import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFile } from '@fortawesome/free-solid-svg-icons';
import Home from '../Home/Home';
import Footer from '../Footer/Footer';
import { ChatContext } from '../../context/ChatContextProvider';
const Navbar = () => {
  const {setResponse,setFileName,fileName } = useContext(ChatContext);
  const fileInputRef = useRef(null); // Ref for file input
  const [file, setFile] = useState(null);
  // const [response, setResponse] = useState('');
  

  const handleFileChange =  async (event) => {

    const selectedFile=event.target.files[0];
    // Submit the form when file is selected
    setFile(selectedFile)
    console.log('line 1',selectedFile)
    console.log('line 1 a',file)
    await handleSubmit(event,selectedFile)

    // handleSubmit(event);
    // console.log('line 2')

  };


  const handleFileButtonClick = () => {
    // Programatically click the hidden file input
    fileInputRef.current.click();
  };



  const handleSubmit = async (e,selectedFile) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file_upload', selectedFile);
    // formData.append('question', question);
    for (var value of formData.values()) {
      console.log(value,'formdata value');
  }

    try {
      const response = await fetch('http://127.0.0.1:8000/items/', {
        method: 'POST',
        headers: {
          // "Content-Type": "multipart/form-data",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // headers: {
          //   'Origin': 'http://localhost:5173'
          // }
          body:  formData,
      });

      const result = await response.json();
      if (response.ok) {
        console.log('successful')
        console.log(result, 'result')
        setResponse(result.status);
        setFile(result.file)
        setFileName(result.file)
        // setResponse(null)
        
      }else{
        console.log('failed');
      }
    }
    catch (error) {
      console.error('error:', error);
    }
  };

  return (
    <>
      <div className='navbar'>
        <img src={assets.logo} alt="" className='logo' />

        <form className='navbar-right' onSubmit={handleSubmit}>
          {file && (
            <div className='navbar-selected-file'>
              <FontAwesomeIcon icon={faFile} />
              <p>{fileName}</p>
              {/* You can render additional information about the selected file here */}
            </div>
          )}
          <button onClick={handleFileButtonClick} type='button' className='navbar-right'>

            <input ref={fileInputRef} style={{ display: 'none' }} type="file" onChange={handleFileChange} />
            <FontAwesomeIcon icon={faPlus} />
            <h3>Select PDF</h3>


          </button>
          {/* <button type='submit'>Upload</button> */}
        </form>

      </div>
      <hr />
      {/* <Home  response={response}/> */}
      {/* <Footer file={file} /> */}
    </>

  )
}

export default Navbar
