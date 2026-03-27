import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../user";

@Entity({ name: 'ActionLog' })
export class ActionLogEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar'})
    action: string;

    @Column({ type: 'varchar', nullable: true })
    entityName: string;

    @Column({ type: 'bigint', nullable: true })
    entityId: number;

    @ManyToOne(() => UserEntity, (us) => us.secretKey, { nullable: false })
    userId: string;

    @Column({ type: 'text', nullable: true })
    details: string;

    @CreateDateColumn()
    created_at: Date;
}
