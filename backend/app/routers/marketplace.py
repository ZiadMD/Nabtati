from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
import uuid
from enum import Enum

from ..database import get_db
from ..models import ProductCategory, Product, ProductReview, Order, OrderItem, OrderStatus, User
from ..services import auth_service

router = APIRouter()

# Pydantic models for request/response
class CategoryBase(BaseModel):
    name: str
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class ProductBase(BaseModel):
    name: str
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    price: float
    stock_quantity: int
    category_id: str
    is_plant: bool = False
    care_instructions: Optional[str] = None
    care_instructions_ar: Optional[str] = None
    latin_name: Optional[str] = None
    sunlight_requirements: Optional[str] = None
    sunlight_requirements_ar: Optional[str] = None
    watering_frequency: Optional[str] = None
    watering_frequency_ar: Optional[str] = None
    size: Optional[str] = None
    size_ar: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    category_id: Optional[str] = None
    is_plant: Optional[bool] = None
    care_instructions: Optional[str] = None
    care_instructions_ar: Optional[str] = None
    latin_name: Optional[str] = None
    sunlight_requirements: Optional[str] = None
    sunlight_requirements_ar: Optional[str] = None
    watering_frequency: Optional[str] = None
    watering_frequency_ar: Optional[str] = None
    size: Optional[str] = None
    size_ar: Optional[str] = None

class ProductResponse(ProductBase):
    id: str
    image_url: Optional[str] = None
    average_rating: Optional[float] = None
    review_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: CategoryResponse
    
    class Config:
        orm_mode = True

class ReviewBase(BaseModel):
    product_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class OrderItemBase(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: str
    order_id: str
    price_per_unit: float
    product: ProductResponse
    
    class Config:
        orm_mode = True

class OrderStatusEnum(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderBase(BaseModel):
    shipping_address: str
    shipping_city: str
    shipping_country: str
    shipping_postal_code: Optional[str] = None
    contact_phone: str
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    status: OrderStatusEnum

class OrderResponse(OrderBase):
    id: str
    user_id: str
    status: OrderStatusEnum
    total_amount: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []
    
    class Config:
        orm_mode = True

# Routes
# Categories
@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category: CategoryCreate,
    current_user: User = Depends(auth_service.get_current_admin_user),
    db: Session = Depends(get_db)
):
    # Create new category
    db_category = ProductCategory(
        id=str(uuid.uuid4()),
        **category.dict()
    )
    
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    
    return db_category

@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    categories = db.query(ProductCategory).offset(skip).limit(limit).all()
    return categories

@router.get("/categories/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: str,
    db: Session = Depends(get_db)
):
    category = db.query(ProductCategory).filter(ProductCategory.id == category_id).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    return category

# Products
@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    current_user: User = Depends(auth_service.get_current_admin_user),
    db: Session = Depends(get_db)
):
    # Check if category exists
    category = db.query(ProductCategory).filter(ProductCategory.id == product.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Create new product
    db_product = Product(
        id=str(uuid.uuid4()),
        **product.dict()
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product

@router.get("/products", response_model=List[ProductResponse])
async def get_products(
    category_id: Optional[str] = None,
    is_plant: Optional[bool] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # Build query
    query = db.query(Product).filter(Product.is_deleted == False)
    
    # Apply filters
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if is_plant is not None:
        query = query.filter(Product.is_plant == is_plant)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_term)) |
            (Product.name_ar.ilike(search_term)) |
            (Product.description.ilike(search_term)) |
            (Product.description_ar.ilike(search_term)) |
            (Product.latin_name.ilike(search_term))
        )
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Get products
    products = query.offset(skip).limit(limit).all()
    
    return products

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_deleted == False
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product

@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_user: User = Depends(auth_service.get_current_admin_user),
    db: Session = Depends(get_db)
):
    # Get product
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_deleted == False
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if category exists if provided
    if product_update.category_id:
        category = db.query(ProductCategory).filter(ProductCategory.id == product_update.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
    
    # Update product fields
    update_data = product_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    
    return product

@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    current_user: User = Depends(auth_service.get_current_admin_user),
    db: Session = Depends(get_db)
):
    # Get product
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_deleted == False
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Soft delete
    product.is_deleted = True
    db.commit()
    
    return None

@router.post("/products/{product_id}/upload-image", response_model=ProductResponse)
async def upload_product_image(
    product_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(auth_service.get_current_admin_user),
    db: Session = Depends(get_db)
):
    # Get product
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_deleted == False
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/gif"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image (JPEG, PNG, or GIF)"
        )
    
    # In a real app, this would upload the file to a storage service
    # and update the product's image_url with the URL of the uploaded file
    # For now, we'll just update with a placeholder URL
    product.image_url = f"/uploads/products/{product_id}/{file.filename}"
    db.commit()
    db.refresh(product)
    
    return product

# Reviews
@router.post("/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    review: ReviewCreate,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    # Check if product exists
    product = db.query(Product).filter(
        Product.id == review.product_id,
        Product.is_deleted == False
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if user has already reviewed this product
    existing_review = db.query(ProductReview).filter(
        ProductReview.product_id == review.product_id,
        ProductReview.user_id == current_user.id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this product"
        )
    
    # Create new review
    db_review = ProductReview(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        **review.dict()
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Update product's average rating
    product_reviews = db.query(ProductReview).filter(ProductReview.product_id == product.id).all()
    total_rating = sum(r.rating for r in product_reviews)
    product.average_rating = total_rating / len(product_reviews)
    product.review_count = len(product_reviews)
    db.commit()
    
    return db_review

@router.get("/products/{product_id}/reviews", response_model=List[ReviewResponse])
async def get_product_reviews(
    product_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # Check if product exists
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_deleted == False
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Get reviews
    reviews = db.query(ProductReview).filter(
        ProductReview.product_id == product_id
    ).order_by(ProductReview.created_at.desc()).offset(skip).limit(limit).all()
    
    return reviews

# Orders
@router.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order: OrderCreate,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    # Check if order has items
    if not order.items or len(order.items) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must have at least one item"
        )
    
    # Create new order
    order_id = str(uuid.uuid4())
    db_order = Order(
        id=order_id,
        user_id=current_user.id,
        status=OrderStatus.PENDING,
        total_amount=0,  # Will be calculated below
        **order.dict(exclude={"items"})
    )
    
    db.add(db_order)
    
    # Create order items and calculate total
    total_amount = 0
    for item in order.items:
        # Get product
        product = db.query(Product).filter(
            Product.id == item.product_id,
            Product.is_deleted == False
        ).first()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {item.product_id} not found"
            )
        
        # Check stock
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not enough stock for product {product.name}. Available: {product.stock_quantity}"
            )
        
        # Create order item
        order_item = OrderItem(
            id=str(uuid.uuid4()),
            order_id=order_id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_per_unit=product.price
        )
        
        db.add(order_item)
        
        # Update product stock
        product.stock_quantity -= item.quantity
        
        # Add to total
        total_amount += product.price * item.quantity
    
    # Update order total
    db_order.total_amount = total_amount
    
    db.commit()
    db.refresh(db_order)
    
    return db_order

@router.get("/orders", response_model=List[OrderResponse])
async def get_orders(
    current_user: User = Depends(auth_service.get_current_user),
    status: Optional[OrderStatusEnum] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # Build query
    query = db.query(Order).filter(Order.user_id == current_user.id)
    
    # Filter by status if provided
    if status:
        query = query.filter(Order.status == status)
    
    # Get orders
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    return orders

@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    # Get order
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return order

@router.put("/orders/{order_id}", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    order_update: OrderUpdate,
    current_user: User = Depends(auth_service.get_current_admin_user),
    db: Session = Depends(get_db)
):
    # Get order
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Update status
    order.status = order_update.status
    db.commit()
    db.refresh(order)
    
    return order

@router.delete("/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_order(
    order_id: str,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    # Get order
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check if order can be cancelled
    if order.status != OrderStatus.PENDING and order.status != OrderStatus.PROCESSING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order cannot be cancelled in its current status"
        )
    
    # Update status to cancelled
    order.status = OrderStatus.CANCELLED
    
    # Restore product stock
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.stock_quantity += item.quantity
    
    db.commit()
    
    return None