import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, ManyToOne, Relation, ManyToMany, JoinTable } from "typeorm";
import { OrderProductEntity } from "../order";
@Entity({ name: 'TagsDetail' })
export class TagsEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column() 
    type: string;

    @Column()
    value: string;

    @ManyToMany(() => ProductDetailEntity, (productDetail) => productDetail.size)
    productDetail: Relation<ProductDetailEntity[]>;
}

@Entity({ name: 'ImageDetail' })
export class ImageDetailEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    url: string;

    @Column({ type: 'simple-array', nullable: true })
    link?: string[];

    @ManyToOne(() => ProductDetailEntity, (pd) => pd.imgDisplay, { nullable: true })
    productDetail: Relation<ProductDetailEntity>;
}

@Entity({ name: 'ProductDetail' })
export class ProductDetailEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @OneToMany(() => ImageDetailEntity, (img) => img.productDetail)
    imgDisplay: Relation<ImageDetailEntity[]>;

    @ManyToMany(()=> TagsEntity, (tag) => tag.productDetail)
    @JoinTable()
    size: Relation<TagsEntity[]>;

    @ManyToOne(() => TagsEntity, { nullable: true })
    @JoinColumn()
    brand: TagsEntity;
    
    @ManyToOne(() => TagsEntity, { nullable: true })
    @JoinColumn()
    fragranceNotes: TagsEntity;

    @ManyToOne(() => TagsEntity, { nullable: true })
    @JoinColumn()
    sillage: TagsEntity;

    @ManyToOne(() => TagsEntity, { nullable: true })
    @JoinColumn()
    longevity: TagsEntity;

    @ManyToOne(() => TagsEntity, { nullable: true })
    @JoinColumn()
    concentration: TagsEntity;

    @ManyToOne(() => TagsEntity, { nullable: true })
    @JoinColumn()
    sex: TagsEntity;

    @Column({ type: 'longtext', nullable: true }) 
    description?: string;

    @Column({ type: 'longtext', nullable: true }) 
    tutorial?: string;
}



@Entity({ name: 'Product' })
export class ProductEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column() 
    name: string;

    @Column({ type: 'boolean' })
    isDisplay: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    originCost: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    displayCost: number;

    @Column({ type: 'bigint', nullable: true, default: 0 })
    stockQuantity?: number;

    @Column({ nullable: true, default: 'perfume'})
    category?: string;

    @Column({ type: 'bigint', nullable: true, default: 0 })
    buyCount?: number;

    @Column({ type: 'float', nullable: true, default: 0 })
    rating?: number;

    @OneToOne(() => ProductDetailEntity)
    @JoinColumn()
    details: ProductDetailEntity;

    @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.product)
    orderProducts: Relation<OrderProductEntity[]>;
    
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
