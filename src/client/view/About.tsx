import React from "react"

import { observable, computed, action, makeObservable, autorun } from "mobx"
import { observer } from "mobx-react"

declare global {
  function prompt(message: string, defaultValue?: string): string
}

// export class Survey {
//   @observable percentage = 0.25
//   breakfast = new Servings()
//   lunch = new Servings()
//   dinner = new Servings()
//   @observable numberDaysOpenPerWeek = 5
//   @observable weeksOpenPerYear = 51

//   @action setWeekOpenPerYear(a: number) {
//     this.weeksOpenPerYear = a
//   }

//   @computed
//   get total(): number {
//     return this.percentage
//       * (this.breakfast.total + this.lunch.total + this.dinner.total)
//       * this.numberDaysOpenPerWeek
//       * this.weeksOpenPerYear
//   }
// }

// class Servings {
//   @observable numberOfMeals = 10
//   @observable averagePrice = 4.99

//   @computed get total(): number {
//     return this.numberOfMeals * this.averagePrice
//   }
// }

// interface InputProps {
//   label: string
//   model: string | number
// }

// @observer
// export class Input extends React.Component<InputProps> {
//   static idCounter = 0

//   id: string

//   constructor(props: InputProps) {
//     super(props)

//     this.id = `input-${++Input.idCounter}`

//     this.onChange = this.onChange.bind(this)
//   }

//   componentDidMount() {
//     this.props.model.modified.add(() => {
//       this.setState({ value: `${this.props.model.value}` })
//     }, this)
//   }

//   componentWillUnmount() {
//     this.props.model.modified.remove(this)
//   }

//   onChange(event: React.ChangeEvent<HTMLInputElement>): boolean {
//     if (this.props.model instanceof NumberModel) {
//       const value = Number.parseFloat(event.target.value)
//       if (!Number.isNaN(value))
//         this.props.model.value = value
//       this.setState({ value: event.target.value })
//     } else {
//       this.props.model.value = event.target.value
//     }
//     return true
//   }

//   render(): React.ReactNode {
//     return <div className="inputWithLabel">
//       <label htmlFor={this.id}>{this.props.label}</label>
//       <input id={this.id} value={this.state.value} onChange={this.onChange} />
//     </div>
//   }
// }

// const survey = observable(new Survey())

interface Assignee {
  name: string
}

interface Todo {
  completed: boolean
  task: string
  assignee: Assignee | null
}

class TodoStore {
  todos: Todo[] = [];
  pendingRequests = 0;

  addTodo(task: string): void {
    this.todos.push({
      task: task,
      completed: false,
      assignee: null
    })
    this.pendingRequests++
  }

  constructor() {
    makeObservable(this, {
      todos: observable,
      pendingRequests: observable,
      completedTodosCount: computed,
      report: computed,
      addTodo: action,
    })
    autorun(() => console.log(this.report))
  }

  get completedTodosCount(): number {
    return this.todos.filter(
      todo => todo.completed === true
    ).length
  }

  get report(): string {
    if (this.todos.length === 0)
      return "<none>"
    const nextTodo = this.todos.find(todo => todo.completed === false)
    return `Next todo: "${nextTodo ? nextTodo.task : "<none>"}". ` +
      `Progress: ${this.completedTodosCount}/${this.todos.length}`
  }
}

const observableTodoStore = new TodoStore()

const TodoList: React.VFC<{ store: TodoStore }> = observer(({ store }) => {
  const onNewTodo = () => {
    store.addTodo(prompt('Enter a new todo:', 'coffee plz'))
  }

  return (
    <div>
      <div style={{ border: "1px #000 solid" }}>
        <h3>store.report</h3>
        {store.report}
      </div>

      <div style={{ border: "1px #000 solid" }}>
        <h3>store.todos</h3>
        <ul>
          {store.todos.map((todo, idx) =>
            <TodoView todo={todo} key={idx} />
          )}
        </ul>
      </div>
      <div style={{ border: "1px #000 solid" }}>
        <h3>store.pendingRequests</h3>
        {store.pendingRequests > 0 ? <div>Loading...</div> : null}
      </div>
      <button onClick={onNewTodo}>New Todo</button>
      <small>(double-click a todo to edit)</small>
    </div>
  )
})

const TodoView: React.VFC<{ todo: Todo }> = observer(({ todo }) => {
  const onToggleCompleted = () => {
    todo.completed = !todo.completed
  }

  const onRename = () => {
    todo.task = prompt('Task name', todo.task) || todo.task
  }

  return (
    <li onDoubleClick={onRename}>
      <input
        type='checkbox'
        checked={todo.completed}
        onChange={onToggleCompleted}
      />
      { todo.task}
      { todo.assignee
        ? <small>{todo.assignee.name}</small>
        : null
      }
    </li>
  )
})

export const About: React.VFC = () => {
  // return <About2 survey={survey} />
  return <TodoList store={observableTodoStore} />
}

// export const About2: React.VFC<{ survey: Survey }> = observer(({ survey }) => {
//   return <>
//     <h1>Potential Calculator</h1>
//     Total Potential €{survey.total.toFixed(2)}
//     <Observer>{() => <>{survey.total.toFixed(2)}</>}</Observer>

//     <h2>Servings</h2>

//     {[
//       { title: "☕️ Breakfast", serving: survey.breakfast },
//       { title: "🍱 Lunch", serving: survey.lunch },
//       { title: "🍷 Dinner", serving: survey.dinner }].map(item =>
//         <>
//           <h3>{item.title}</h3>
//           Daily Servings
//           <input defaultValue={item.serving.numberOfMeals} />
//           Average Price €
//           <input defaultValue={item.serving.averagePrice} />
//         </>
//       )
//     }

//     <h2>Business Hours</h2>
//     Days open per week
//     <input defaultValue={survey.numberDaysOpenPerWeek} />
//     Weeks open per year
//     <input defaultValue={survey.weeksOpenPerYear} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
//       const value = Number.parseFloat(event.target.value)
//       if (!Number.isNaN(value)) {
//         // survey.setWeekOpenPerYear(value)
//         survey.weeksOpenPerYear = value
//         console.log(`call setWeekOpenPerYear()`)
//       }
//       console.log(`updated value to ${value}`)
//     }} />
//   </>
// })
