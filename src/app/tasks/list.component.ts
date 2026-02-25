import { Component, OnInit } from '@angular/core';
import { TaskService } from '@app/_services/task.service';
import { Task } from '@app/_models/task';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    tasks: Task[] = [];
    loading = false;
    showForm = false;
    newTask = { title: '', description: '' };
    taskToDelete: number | null = null;
    showDeleteModal = false;
    showFormError = false;
    showSuccess = false;

    constructor(private taskService: TaskService) {}

    ngOnInit() { this.loadTasks(); }

    loadTasks() {
        this.loading = true;
        this.taskService.getAll().subscribe(tasks => {
            this.tasks = tasks.sort((a, b) => {
                if (a.status === 'Completed' && b.status !== 'Completed') return 1;
                if (a.status !== 'Completed' && b.status === 'Completed') return -1;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
            this.loading = false;
        });
    }

    get highTasks() { return this.tasks.filter(t => t.priority === 'High'); }
    get mediumTasks() { return this.tasks.filter(t => t.priority === 'Medium'); }
    get lowTasks() { return this.tasks.filter(t => t.priority === 'Low'); }

    createTask() {
        if (!this.newTask.title || !this.newTask.description) {
            this.showFormError = true;
            return;
        }
        this.showFormError = false;
        this.taskService.create(this.newTask).subscribe(() => {
            this.newTask = { title: '', description: '' };
            this.showForm = false;
            this.showSuccess = true;
            setTimeout(() => this.showSuccess = false, 3000); // disappears after 3s
            this.loadTasks();
        });
    }

    updateStatus(task: Task, status: string) {
        this.taskService.update(task.id, { status }).subscribe(() => {
            this.loadTasks();
        });
    }

    deleteTask(id: number) {
        this.taskToDelete = id;
        this.showDeleteModal = true;
    }

    confirmDelete() {
        if (!this.taskToDelete) return;
        this.taskService.delete(this.taskToDelete).subscribe(() => {
            this.taskToDelete = null;
            this.showDeleteModal = false;
            this.loadTasks();
        });
    }
}