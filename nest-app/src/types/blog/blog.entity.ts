import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'Blog' })
export class BlogEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'boolean' })
    isDisplay: boolean;

    @Column()
    title: string;

    @Column()
    typeBlog: string;

    @Column({ type: 'longtext', nullable: true}) 
    content?: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}