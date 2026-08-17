package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.OrderDtos.PlaceOrderRequest;
import com.shopsphere.backend.entity.CartItem;
import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.entity.OrderItem;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.enums.OrderStatus;
import com.shopsphere.backend.enums.PaymentMethod;
import com.shopsphere.backend.enums.PaymentStatus;
import com.shopsphere.backend.enums.ProductStatus;
import com.shopsphere.backend.exception.BadRequestException;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.CartItemRepository;
import com.shopsphere.backend.repository.OrderRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Order placeOrder(
            Long customerId,
            PlaceOrderRequest request
    ) {

        if (request == null) {
            throw new BadRequestException("Order request is required");
        }

        User customer = userRepository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found"
                        )
                );

        List<CartItem> cartItems =
                cartItemRepository.findByCustomerId(customerId);

        if (cartItems == null || cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        validateShippingDetails(request);

        PaymentMethod paymentMethod =
                request.getPaymentMethod();

        if (paymentMethod == null) {
            paymentMethod = PaymentMethod.COD;
            request.setPaymentMethod(paymentMethod);
        }

        validatePaymentDetails(
                request,
                paymentMethod
        );

        Order order = Order.builder()
                .orderNumber(
                        "ORD-" +
                                UUID.randomUUID()
                                        .toString()
                                        .substring(0, 8)
                                        .toUpperCase()
                )
                .customer(customer)
                .shippingAddress(
                        request.getShippingAddress()
                )
                .shippingCity(
                        request.getShippingCity()
                )
                .shippingState(
                        request.getShippingState()
                )
                .shippingPincode(
                        request.getShippingPincode()
                )
                .shippingMobile(
                        request.getShippingMobile()
                )
                .paymentMethod(paymentMethod)
                .status(OrderStatus.PLACED)
                .paymentStatus(
                        paymentMethod == PaymentMethod.COD
                                ? PaymentStatus.PENDING
                                : PaymentStatus.PAID
                )
                .build();

        if (order.getItems() == null) {
            throw new BadRequestException(
                    "Unable to initialize order items"
            );
        }

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {

            if (cartItem == null ||
                    cartItem.getProduct() == null) {

                throw new BadRequestException(
                        "Invalid cart item"
                );
            }

            Product product =
                    cartItem.getProduct();

            validateProductForOrder(product);

            Integer quantity =
                    cartItem.getQuantity();

            if (quantity == null ||
                    quantity <= 0) {

                throw new BadRequestException(
                        "Invalid quantity for product: " +
                                product.getName()
                );
            }

            Integer stock =
                    product.getStock();

            if (stock == null ||
                    stock < quantity) {

                throw new BadRequestException(
                        "Insufficient stock for product: " +
                                product.getName()
                );
            }

            BigDecimal productPrice =
                    product.getPrice() == null
                            ? BigDecimal.ZERO
                            : product.getPrice();

            BigDecimal discount =
                    product.getDiscount() == null
                            ? BigDecimal.ZERO
                            : BigDecimal.valueOf(
                            product.getDiscount()
                    );

            BigDecimal discountAmount =
                    productPrice
                            .multiply(discount)
                            .divide(
                                    BigDecimal.valueOf(100),
                                    2,
                                    RoundingMode.HALF_UP
                            );

            BigDecimal effectivePrice =
                    productPrice
                            .subtract(discountAmount)
                            .setScale(
                                    2,
                                    RoundingMode.HALF_UP
                            );

            BigDecimal lineTotal =
                    effectivePrice.multiply(
                            BigDecimal.valueOf(quantity)
                    );

            subtotal =
                    subtotal.add(lineTotal);

            OrderItem orderItem =
                    OrderItem.builder()
                            .order(order)
                            .product(product)
                            .productName(
                                    product.getName()
                            )
                            .quantity(quantity)
                            .price(effectivePrice)
                            .build();

            order.getItems().add(orderItem);

            int remainingStock =
                    stock - quantity;

            product.setStock(
                    remainingStock
            );

            if (remainingStock <= 0) {
                product.setStatus(
                        ProductStatus.OUT_OF_STOCK
                );
            }

            productRepository.save(product);
        }

        subtotal =
                subtotal.setScale(
                        2,
                        RoundingMode.HALF_UP
                );

        BigDecimal shipping =
                subtotal.compareTo(
                        BigDecimal.valueOf(999)
                ) >= 0
                        ? BigDecimal.ZERO
                        : BigDecimal.valueOf(79);

        BigDecimal total =
                subtotal
                        .add(shipping)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        order.setShippingAmount(
                shipping
        );

        order.setTotalAmount(
                total
        );

        Order savedOrder =
                orderRepository.save(order);

        cartItemRepository.deleteByCustomerId(
                customerId
        );

        initializeOrder(savedOrder);

        return savedOrder;
    }

    private void validateShippingDetails(
            PlaceOrderRequest request
    ) {

        if (request.getShippingAddress() == null ||
                request.getShippingAddress().trim().isEmpty()) {

            throw new BadRequestException(
                    "Shipping address is required"
            );
        }

        if (request.getShippingCity() == null ||
                request.getShippingCity().trim().isEmpty()) {

            throw new BadRequestException(
                    "Shipping city is required"
            );
        }

        if (request.getShippingState() == null ||
                request.getShippingState().trim().isEmpty()) {

            throw new BadRequestException(
                    "Shipping state is required"
            );
        }

        if (request.getShippingPincode() == null ||
                !request.getShippingPincode()
                        .trim()
                        .matches("\\d{6}")) {

            throw new BadRequestException(
                    "Shipping pincode must be 6 digits"
            );
        }

        if (request.getShippingMobile() == null ||
                !request.getShippingMobile()
                        .trim()
                        .matches("\\d{10}")) {

            throw new BadRequestException(
                    "Shipping mobile must be 10 digits"
            );
        }
    }

    private void validatePaymentDetails(
            PlaceOrderRequest request,
            PaymentMethod paymentMethod
    ) {

        if (paymentMethod == PaymentMethod.COD) {
            return;
        }

        if (paymentMethod == PaymentMethod.CARD) {

            String cardNumber =
                    request.getCardNumber();

            String expiry =
                    request.getCardExpiry();

            String cvv =
                    request.getCardCvv();

            if (cardNumber == null ||
                    cardNumber.trim().isEmpty()) {

                throw new BadRequestException(
                        "Mock card number is required"
                );
            }

            if (expiry == null ||
                    expiry.trim().isEmpty()) {

                throw new BadRequestException(
                        "Card expiry is required"
                );
            }

            if (cvv == null ||
                    cvv.trim().isEmpty()) {

                throw new BadRequestException(
                        "Card CVV is required"
                );
            }

            return;
        }

        String paymentReference =
                request.getPaymentReference();

        if (paymentReference == null ||
                paymentReference.trim().isEmpty()) {

            throw new BadRequestException(
                    "Payment reference is required"
            );
        }
    }

    private void validateProductForOrder(
            Product product
    ) {

        if (product == null) {
            throw new ResourceNotFoundException(
                    "Product not found"
            );
        }

        if (!Boolean.TRUE.equals(
                product.getActive()
        )) {

            throw new BadRequestException(
                    "Product is inactive"
            );
        }

        if (product.getStatus() ==
                ProductStatus.INACTIVE ||
                product.getStatus() ==
                        ProductStatus.DISCONTINUED) {

            throw new BadRequestException(
                    "Product is no longer available"
            );
        }

        if (product.getStock() == null ||
                product.getStock() <= 0 ||
                product.getStatus() ==
                        ProductStatus.OUT_OF_STOCK) {

            throw new BadRequestException(
                    "Product is out of stock"
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Order getById(
            Long id
    ) {

        Order order =
                orderRepository.findDetailedById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found with id: " +
                                                id
                                )
                        );

        initializeOrder(order);

        return order;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Order> getByCustomer(
            Long customerId,
            Pageable pageable
    ) {

        userRepository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found"
                        )
                );

        Page<Order> orders =
                orderRepository.findByCustomerId(
                        customerId,
                        pageable
                );

        orders.forEach(
                this::initializeOrder
        );

        return orders;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Order> getAll(
            Pageable pageable
    ) {

        Page<Order> orders =
                orderRepository.findAll(
                        pageable
                );

        orders.forEach(
                this::initializeOrder
        );

        return orders;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Order> getByStatus(
            OrderStatus status,
            Pageable pageable
    ) {

        if (status == null) {
            throw new BadRequestException(
                    "Order status is required"
            );
        }

        Page<Order> orders =
                orderRepository.findByStatus(
                        status,
                        pageable
                );

        orders.forEach(
                this::initializeOrder
        );

        return orders;
    }

    private void initializeOrder(
            Order order
    ) {

        if (order == null) {
            return;
        }

        if (order.getCustomer() != null) {
            Hibernate.initialize(
                    order.getCustomer()
            );
        }

        if (order.getItems() != null) {

            Hibernate.initialize(
                    order.getItems()
            );

            for (OrderItem item :
                    order.getItems()) {

                if (item == null) {
                    continue;
                }

                if (item.getProduct() != null) {

                    Hibernate.initialize(
                            item.getProduct()
                    );

                    Product product =
                            item.getProduct();

                    if (product.getImages() != null) {

                        Hibernate.initialize(
                                product.getImages()
                        );
                    }

                    if (product.getBrand() != null) {
                        Hibernate.initialize(
                                product.getBrand()
                        );
                    }

                    if (product.getCategory() != null) {
                        Hibernate.initialize(
                                product.getCategory()
                        );
                    }
                }
            }
        }
    }

    @Override
    @Transactional
    public Order updateStatus(
            Long id,
            OrderStatus newStatus
    ) {

        if (newStatus == null) {
            throw new BadRequestException(
                    "Order status is required"
            );
        }

        Order order =
                orderRepository.findDetailedById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found with id: " +
                                                id
                                )
                        );

        OrderStatus currentStatus =
                order.getStatus();

        if (currentStatus == null) {
            throw new BadRequestException(
                    "Current order status is missing"
            );
        }

        if (currentStatus ==
                OrderStatus.CANCELLED ||
                currentStatus ==
                        OrderStatus.DELIVERED ||
                currentStatus ==
                        OrderStatus.RETURNED) {

            throw new BadRequestException(
                    "This order is already in a final state"
            );
        }

        if (currentStatus == newStatus) {
            throw new BadRequestException(
                    "Order is already in " +
                            newStatus +
                            " status"
            );
        }

        if (!isValidStatusTransition(
                currentStatus,
                newStatus
        )) {

            throw new BadRequestException(
                    "Invalid order status transition: " +
                            currentStatus +
                            " -> " +
                            newStatus
            );
        }

        if (newStatus ==
                OrderStatus.CANCELLED) {

            restoreOrderStock(order);
        }

        order.setStatus(
                newStatus
        );

        if (newStatus ==
                OrderStatus.DELIVERED) {

            order.setPaymentStatus(
                    PaymentStatus.PAID
            );
        }

        Order savedOrder =
                orderRepository.save(order);

        initializeOrder(savedOrder);

        return savedOrder;
    }

    private boolean isValidStatusTransition(
            OrderStatus currentStatus,
            OrderStatus newStatus
    ) {

        if (currentStatus == null ||
                newStatus == null) {

            return false;
        }

        switch (currentStatus) {

            case PLACED:
                return newStatus ==
                        OrderStatus.CONFIRMED
                        ||
                        newStatus ==
                                OrderStatus.CANCELLED;

            case CONFIRMED:
                return newStatus ==
                        OrderStatus.PROCESSING
                        ||
                        newStatus ==
                                OrderStatus.CANCELLED;

            case PROCESSING:
                return newStatus ==
                        OrderStatus.SHIPPED
                        ||
                        newStatus ==
                                OrderStatus.CANCELLED;

            case SHIPPED:
                return newStatus ==
                        OrderStatus.OUT_FOR_DELIVERY
                        ||
                        newStatus ==
                                OrderStatus.CANCELLED;

            case OUT_FOR_DELIVERY:
                return newStatus ==
                        OrderStatus.DELIVERED;

            case DELIVERED:
            case CANCELLED:
            case RETURNED:
                return false;

            default:
                return false;
        }
    }

    @Override
    @Transactional
    public Order cancelOrder(
            Long id,
            Long customerId
    ) {

        Order order =
                orderRepository.findDetailedById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found with id: " +
                                                id
                                )
                        );

        if (order.getCustomer() == null ||
                order.getCustomer().getId() == null ||
                !order.getCustomer()
                        .getId()
                        .equals(customerId)) {

            throw new BadRequestException(
                    "You cannot cancel this order"
            );
        }

        OrderStatus status =
                order.getStatus();

        if (status ==
                OrderStatus.DELIVERED ||
                status ==
                        OrderStatus.SHIPPED ||
                status ==
                        OrderStatus.OUT_FOR_DELIVERY) {

            throw new BadRequestException(
                    "Order cannot be cancelled at this stage"
            );
        }

        if (status ==
                OrderStatus.CANCELLED) {

            throw new BadRequestException(
                    "Order is already cancelled"
            );
        }

        if (status ==
                OrderStatus.RETURNED) {

            throw new BadRequestException(
                    "Returned order cannot be cancelled"
            );
        }

        restoreOrderStock(order);

        order.setStatus(
                OrderStatus.CANCELLED
        );

        if (order.getPaymentMethod() !=
                PaymentMethod.COD) {

            order.setPaymentStatus(
                    PaymentStatus.PENDING
            );
        }

        Order savedOrder =
                orderRepository.save(order);

        initializeOrder(savedOrder);

        return savedOrder;
    }

    private void restoreOrderStock(
            Order order
    ) {

        if (order == null ||
                order.getItems() == null) {

            return;
        }

        Hibernate.initialize(
                order.getItems()
        );

        for (OrderItem item :
                order.getItems()) {

            if (item == null ||
                    item.getProduct() == null) {

                continue;
            }

            Product product =
                    item.getProduct();

            Hibernate.initialize(
                    product
            );

            int currentStock =
                    product.getStock() == null
                            ? 0
                            : product.getStock();

            int quantity =
                    item.getQuantity() == null
                            ? 0
                            : item.getQuantity();

            if (quantity <= 0) {
                continue;
            }

            product.setStock(
                    currentStock + quantity
            );

            if (product.getStock() > 0 &&
                    product.getStatus() ==
                            ProductStatus.OUT_OF_STOCK) {

                product.setStatus(
                        ProductStatus.ACTIVE
                );
            }

            productRepository.save(
                    product
            );
        }
    }
}