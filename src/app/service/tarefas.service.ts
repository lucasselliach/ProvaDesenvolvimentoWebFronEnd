import { Injectable } from "@angular/core";

import { TarefaModel } from "./../model/tarefas.model";

@Injectable()
export class TarefaService {
    constructor() {}

    getsaveLocalTarefa() : TarefaModel[]{
        return Object.assign([], JSON.parse(localStorage.getItem('ProjetoWeb.Tarefa')));
    }

    saveLocalTarefa(tarefa: TarefaModel[]){
        localStorage.setItem('ProjetoWeb.Tarefa', JSON.stringify(tarefa));
    }
}