import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import Nav from './Components/Header/Nav';
import Modal from './Components/Others/Modal';
import { URL_API, URL_IMAGE_UPLOAD } from './Types';
import SweetAlert from 'sweetalert-react';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import './App.css';
import 'sweetalert/dist/sweetalert.css';

class App extends Component {

	constructor(props){
		super(props);
		
		this.state = { 
			picture: null, 
			picture_base64: null,
			data_api_image: null,
			data_watson_image:null,
			location_face: null,
			image_loaded_data: {},
			show_modal: false,
			null_faces: false
		};
		this.image_ref = React.createRef();
		this.onDrop = this.onDrop.bind(this);
	}

	componentDidMount() {
		window.addEventListener("resize", this.updateDimensions.bind(this));
	}

	readFile(file) {
		this.setState({
			picture: null,
			picture_base64: null,
			data_api_image: null,
			data_watson_image:null,
			location_face: null,
			image_loaded_data: {},
		})
		let _this = this;
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function (e) {
			let dataURL = e.target.result;
			_this.setState({
				picture: file,
				picture_base64: dataURL
			});
			_this.saveImage(dataURL);
		};
		
	}

	onDrop(picture) {
		this.readFile(picture[0])
	}
	
	saveImage(picture_base64){
		let data = {
			file: picture_base64,
			upload_preset: 'nqjxgopk'
		}
		this.show_modal();
		axios.post(URL_IMAGE_UPLOAD, data)
		.then(response => {
			if(response.status === 200){
				this.setState({ data_api_image: response.data });
				this.callWatson(response.data.secure_url);
			}
		}).catch(err => {
			console.log("ERR: ", err);
		});
	}

	callWatson(image){
		axios.post(URL_API, { image_url: image})
		.then(response => {
			this.hide_modal();
			this.setState({
				data_watson_image: response.data,
				location_face: response.data.images[0].faces,
				null_faces: response.data.images[0].faces.length === 0 ? true:false,
			});
		}).catch(err => {
			console.log("ERR: ", err);
		})
	}

	show_modal(){
		this.setState({ show_modal: true });
	}
	hide_modal(){
		this.setState({ show_modal: false });
	}

	showDataImage(){
		if(this.state.data_api_image != null){
			return(
				<Row>
					<Col s={6} offset={'s3'} className='grid-example center-align'>
						<div className="box_image_data">
							<img ref={this.image_ref} src={this.state.data_api_image.secure_url} onLoad={(e) => this._onLoadImage(e)} className="responsive-img" alt="Imagem do Upload" />
							{this.showBox()}
						</div>
						<Col s={8} offset={'s2'} className='grid-example center-align'>
							<button className="btn btn-flat cyan white-text waves-effect waves-light" onClick={() => window.location.reload() }>
								Enviar Outra
							</button>
						</Col>
					</Col>
				</Row>
			)
		}
	}

	_onLoadImage(e) {
		this.setState({
			image_loaded_data:{
				width_original: e.target.naturalWidth,
				height_original: e.target.naturalHeight,
				new_width: e.target.offsetWidth,
				new_height: e.target.offsetHeight
			}
		});
	}

	updateDimensions() {
		if(this.state.data_api_image != null){
			this.setState({
				image_loaded_data:{
					width_original: this.image_ref.current.naturalWidth,
					height_original: this.image_ref.current.naturalHeight,
					new_width: this.image_ref.current.offsetWidth,
					new_height: this.image_ref.current.offsetHeight
				}
			});
		}
	}

	showBox(){
		if(this.state.data_watson_image != null){
			return(
				this.state.location_face.map((value,index) => {
					return(
						<div key={index} className="box" style={{
							top: this.calculateValue(value.face_location.top, 'height'),
							left: this.calculateValue(value.face_location.left, 'width'),
							width: this.calculateValue(value.face_location.width, 'width'),
							height: this.calculateValue(value.face_location.height, 'height')
						}}></div>
					)
				})
			)
		}
	}

	calculateValue(valor, tipo){
		if(tipo === 'height'){
			return (this.state.image_loaded_data.new_height * valor) / this.state.image_loaded_data.height_original;
		} else {
			return (this.state.image_loaded_data.new_width * valor) / this.state.image_loaded_data.width_original;
		}
	}

	showUpload(){
		if(this.state.picture == null){
			return(
				<Row>
					<Col s={6} offset={'s3'} className='grid-example center-align'>
					<ImageUploader
						withIcon={true}
						buttonText='Escolha uma Imagem'
						onChange={this.onDrop}
						imgExtension={['.jpg', '.gif', '.png', '.gif']}
						maxFileSize={5242880}
					/>
					</Col>
				</Row>
			)
		}
	}

  	render() {
    	return (
			<div>
    	  		<Nav/>
				<main>
					<div className="container box_initial">
						{this.showDataImage()}
						{this.showUpload()}
					</div>
				</main>
				<Modal show_modal={this.state.show_modal}/>
				<SweetAlert
        			show={this.state.null_faces}
					title="Ops..."
					text="Nenhum rosto foi encontrado nesta foto"
					onConfirm={() => this.setState({ null_faces: false })}
				/>
			</div>
		);
	}
}

export default App;
