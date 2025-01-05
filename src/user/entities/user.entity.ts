import { Exclude } from "class-transformer";
import { MinLength } from "class-validator";
import { Role } from "src/core/enum/role.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 500 })
    name: string;
  
    @Column({ unique: true, nullable: false })
    email: string;

    @Column( { nullable: false, length: 60} )
    @MinLength(8)
    @Exclude()
    password: string;

    @Column({ default: Role.DEFAULT_USER})
    role: Role;

  
    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at'})
    deletedAt: Date;
}
