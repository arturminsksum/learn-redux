import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";

const todo = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case "TOGGLE_TODO":
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, todo(undefined, action)];
    case "TOGGLE_TODO":
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};

// const combineReducers = reducers => {
//   return (state = {}, action) => {
//     return Object.keys(reducers).reduce((nextState, key) => {
//       nextState[key] = reducers[key](state[key], action);
//       return nextState;
//     }, {});
//   };
// };

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(state.todos, action),
//     visibilityFilter: visibilityFilter(state.visibilityFilter, action)
//   };
// };

const store = createStore(todoApp);

const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

class FilterLink extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <Link
        active={props.filter === state.visibilityFilter}
        onClick={() =>
          store.dispatch({
            type: "SET_VISIBILITY_FILTER",
            filter: props.filter
          })
        }
      >
        {" "}
        {props.children}
      </Link>
    );
  }
}

const Footer = () => (
  <p>
    Show: <FilterLink filter="SHOW_ALL">ALL</FilterLink>{" "}
    <FilterLink filter="SHOW_ACTIVE">ACTIVE</FilterLink>{" "}
    <FilterLink filter="SHOW_COMPLETED">COMPLETED</FilterLink>
  </p>
);

const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? "line-through" : "none"
    }}
  >
    {text}
  </li>
);

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map(todo => (
      <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
    ))}
  </ul>
);

const AddTodo = ({ onAddClick }) => {
  let input;
  return (
    <div>
      <input
        type="text"
        ref={node => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          onAddClick(input.value);
          input.value = "";
        }}
      >
        Add Todo
      </button>
      <Footer />
    </div>
  );
};

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_COMPLETED":
      return todos.filter(t => t.completed);
    case "SHOW_ACTIVE":
      return todos.filter(t => !t.completed);
  }
};

let nextTodoId = 0;
const TodoApp = ({ todos, visibilityFilter }) => (
  <div>
    <AddTodo
      onAddClick={text =>
        store.dispatch({
          type: "ADD_TODO",
          text,
          id: nextTodoId++
        })
      }
    />
    <TodoList
      todos={getVisibleTodos(todos, visibilityFilter)}
      onTodoClick={id =>
        store.dispatch({
          type: "TOGGLE_TODO",
          id
        })
      }
    />
  </div>
);

const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()} />,
    document.getElementById("root")
  );
};

store.subscribe(render);
render();

// console.log(store.getState());

// store.dispatch({
//   type: "ADD_TODO",
//   id: 0,
//   text: "Learn Redux"
// });

// console.log(store.getState());

// store.dispatch({
//   type: "ADD_TODO",
//   id: 1,
//   text: "Go shopping"
// });

// console.log(store.getState());

// store.dispatch({
//   type: "TOGGLE_TODO",
//   id: 0
// });

// console.log(store.getState());

// store.dispatch({
//   type: "SET_VISIBILITY_FILTER",
//   filter: "SHOW_COMPLETED"
// });

// console.log(store.getState());
