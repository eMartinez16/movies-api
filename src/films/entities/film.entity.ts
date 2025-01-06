import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity({ name: 'films' })
export class Film {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 500, unique: true })
    title: string;

    @Column({ length: 500 })
    producer: string;

    @Column({ length: 500 })
    director: string;

    @Column({ type: 'text', name: 'opening_crawl'})
    openingCrawl: string;

    @Column({ type: 'int', name: 'episode_id'})
    episodeId: number;


    @CreateDateColumn({ name: 'release_date'})
    releaseDate: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at'})
    deletedAt: Date;
}
