import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
        setTodos(response.data);
        setFilteredTodos(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchTodos();
  }, []);

  const handleSearch = (query) => {
    const results = todos.filter((todo) =>
      todo.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTodos(results);
    setNoResults(results.length === 0);
  };

  const searchSchema = Yup.object().shape({
    query: Yup.string()
      .required("Search query is required")
      .min(3, "Search query must be at least 3 characters"),
  });

  return (
    <div className="App">
      <h1>Search Todos</h1>

      {/* Formik component to manage the search form */}
      <Formik
        initialValues={{ query: "" }} // Initial value for the search input (empty string)
        validationSchema={searchSchema} // Attach Yup validation schema
        onSubmit={(values, { setSubmitting }) => {
          handleSearch(values.query);
          setSubmitting(false); 
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="query">Search:</label>
              <Field
                type="text"
                name="query"
                placeholder="Enter search term..." 
              />
              <ErrorMessage name="query" component="div" style={{ color: "red" }} />
            </div>
            <div>
              <button type="submit" disabled={isSubmitting}>
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Conditional rendering based on whether there are search results or not */}
      {noResults ? (
        <p>No results found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.title}</td>
                <td>{todo.completed ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
