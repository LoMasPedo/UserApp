import React, { Component, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { getDatabase, ref, onValue, push } from "firebase/database";
import {
  getFirestore,
  addDoc,
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
} from "firebase/firestore";
import firebase from "./application/firebase";
import { dbs } from "./application/firebase";

class User extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEditar: false,
    form: {
      name: "",
      age: "",
      gender: "",
    },
    IdUser: "",
  };

  // Firestore

  addTodo = async () => {
    try {
      const docRef = collection(dbs, "usuarios");
      const userRef = await addDoc(docRef, this.state.form);
      console.log("Document written with ID: ", userRef.id);
      this.peticionGet();
      this.setState({ modalInsertar: false });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // FirestoreGEt

  peticionGet = async () => {
    const db = getFirestore();
    const usuariosRef = collection(db, "usuarios");
    const querySnapshot = await getDocs(usuariosRef);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    this.setState({ data });
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.modalInsertar !== this.state.modalInsertar) {
      // Actualizar el estado de la aplicación después de que se cierra el modal
      this.peticionGet();
      console.log("Actualizando datos");
    }
  }

  componentDidMount() {
    this.peticionGet();
  }

  handleDelete = async (id) => {
    try {
      const docRef = doc(dbs, "usuarios", id);
      await deleteDoc(docRef);
      console.log("Document successfully deleted!");
      this.peticionGet();
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  handleEdit = async (id) => {
    try {
      const docRef = doc(dbs, "usuarios", id);
      await updateDoc(docRef, this.state.form);
      console.log("Document successfully updated!");
      this.peticionGet();
      this.setState({ modalEditar: false });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

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
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      this.setState({
                        modalEditar: true,
                        IdUser: this.state.data[i].id,
                        form: this.state.data[i],
                      });
                    }}
                  >
                    {" "}
                    Edit
                  </button>{" "}
                  {"  "}
                  <button
                    className="btn btn-danger"
                    onClick={() => this.handleDelete(this.state.data[i].id)}
                  >
                    {" "}
                    Delete
                  </button>
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
            <button className="btn btn-primary" onClick={this.addTodo}>
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
        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>Editar registro</ModalHeader>
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
                value={this.state.form && this.state.form.name}
              />
              <br />
              <label>Age: </label>
              <br />
              <input
                type="text"
                className="form-control"
                name="age"
                onChange={this.handleChange}
                value={this.state.form && this.state.form.age}
              />
              <br />
              <label>gender: </label>
              <br />
              <input
                type="text"
                className="form-control"
                name="gender"
                onChange={this.handleChange}
                value={this.state.form && this.state.form.gender}
              />
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-primary"
              onClick={() => this.handleEdit(this.state.IdUser)}
            >
              Editar
            </button>{" "}
            <button
              className="btn btn-danger"
              onClick={() => {
                this.setState({ modalEditar: false });
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
