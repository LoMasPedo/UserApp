import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { getDatabase, ref, onValue, push } from "firebase/database";
import { addDoc } from "firebase/firestore";
import firebase from "./application/firebase";

const db = getDatabase();
const usersRef = ref(db, "usuario");

class User extends Component {
  state = {
    data: [],
    modalInsertar: false,
    form: {
      name: "",
      age: "",
      gender: "",
    },
  };

  peticionGet = () => {
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        this.setState({ data: snapshot.val() });
      } else {
        this.setState({ data: [] });
      }
    });
  };

  //AHORA NECESITO CREAR PETICION POST
  peticionPost = () => {
    push(usersRef, this.state.form, (error) => {
      if (error) {
        console.log("Error al enviar datos a la base de datos:", error);
      } else {
        console.log("Datos agregados correctamente");
        // Actualizar el estado de la aplicación con los nuevos datos
        this.peticionGet();
      }
    });
    this.setState({ modalInsertar: false });
  };

  handleChange = (e) => {
    this.setState({
      form: { ...this.state.form, [e.target.name]: e.target.value },
    });
    console.log(this.state.form);
  };

  handleClick = () => {
    this.setState({ modalInsertar: true });
  };

  handleInsert = () => {
    // Lógica para insertar datos en la base de datos
    this.peticionPost();
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.modalInsertar !== this.state.modalInsertar) {
      // Actualizar el estado de la aplicación después de que se cierra el modal
      this.peticionGet();
      console.log("Actualizando datos");
    }
  }
  render() {
    return (
      <div className="User">
        <h1>User Page</h1>
        <button
          className="btn btn-success"
          onClick={() => this.setState({ modalInsertar: true })}
        >
          Insertar
        </button>
        <br /> <br />
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>gender</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.state.data).map((i) => {
              console.log(i);
              return (
                <tr key={i}>
                  <td>{this.state.data[i].name}</td>
                  <td>{this.state.data[i].age}</td>
                  <td>{this.state.data[i].gender}</td>
                  <button className="btn btn-primary"> Edit</button> {"  "}
                  <button className="btn btn-danger"> Delete</button>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>Insertar registro</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <br />
              <label>Name: </label>
              <br />
              <input
                type="text"
                className="form-control"
                name="name"
                onChange={this.handleChange}
              />
              <br />
              <label>Age: </label>
              <br />
              <input
                type="text"
                className="form-control"
                name="age"
                onChange={this.handleChange}
              />
              <br />
              <label>gender: </label>
              <br />
              <input
                type="text"
                className="form-control"
                name="gender"
                onChange={this.handleChange}
              />
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={this.handleInsert}>
              Insertar
            </button>{" "}
            <button
              className="btn btn-danger"
              onClick={() => {
                this.setState({ modalInsertar: false });
              }}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default User;
