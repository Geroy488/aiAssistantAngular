export class Task {
    id!: number;
    userId!: number;
    title!: string;
    description!: string;
    priority!: 'Low' | 'Medium' | 'High';
    deadline!: string;
    status!: string;
    created_at!: string;
}