import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Task } from '@app/_models/task';

const baseUrl = `${environment.apiUrl}/tasks`;

@Injectable({ providedIn: 'root' })
export class TaskService {
    constructor(private http: HttpClient) {}

    getAll() {
        return this.http.get<Task[]>(baseUrl);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    update(id: number, params: any) {
        return this.http.put(`${baseUrl}/${id}`, params);
    }

    delete(id: number) {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}