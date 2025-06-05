from sqlalchemy import Boolean, Column, String, Integer, DateTime, ForeignKey, Float, Table, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from ..database import Base

# Product Category Enum
class ProductCategory(enum.Enum):
    INDOOR_PLANTS = "indoor_plants"
    OUTDOOR_PLANTS = "outdoor_plants"
    SEEDS = "seeds"
    POTS = "pots"
    SOIL = "soil"
    FERTILIZERS = "fertilizers"
    TOOLS = "tools"
    ACCESSORIES = "accessories"

# Order Status Enum
class OrderStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

# Product model
class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    name_ar = Column(String, nullable=True)
    description = Column(Text)
    description_ar = Column(Text, nullable=True)
    price = Column(Float)
    discount_price = Column(Float, nullable=True)
    category = Column(Enum(ProductCategory))
    image_url = Column(String, nullable=True)
    additional_images = Column(JSON, nullable=True)  # List of additional image URLs
    stock_quantity = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
    rating = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    specifications = Column(JSON, nullable=True)  # JSON object with product specifications
    specifications_ar = Column(JSON, nullable=True)  # JSON object with product specifications in Arabic
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    reviews = relationship("ProductReview", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")

# Product Review model
class ProductReview(Base):
    __tablename__ = "product_reviews"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    rating = Column(Integer)  # 1-5 stars
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign keys
    product_id = Column(String, ForeignKey("products.id"))
    user_id = Column(String, ForeignKey("users.id"))
    
    # Relationships
    product = relationship("Product", back_populates="reviews")
    user = relationship("User")

# Order model
class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    total_amount = Column(Float)
    shipping_address = Column(String)
    shipping_address_ar = Column(String, nullable=True)
    tracking_number = Column(String, nullable=True)
    payment_method = Column(String)
    payment_id = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    user_id = Column(String, ForeignKey("users.id"))
    
    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

# Order Item model
class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    quantity = Column(Integer)
    unit_price = Column(Float)
    total_price = Column(Float)
    
    # Foreign keys
    order_id = Column(String, ForeignKey("orders.id"))
    product_id = Column(String, ForeignKey("products.id"))
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")