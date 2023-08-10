import React, { useEffect, useState } from 'react';
import './Upload.css'

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';

function UploadPost() {
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  let inputRef;

  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [content, setContent] = useState("");

  const jsonData = {
    recipeId: selectedRecipeId,
    contents: content,
  };

  const saveImage = (e) => {
    e.preventDefault();
    const tmpFileList = [];
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length && fileList.length < 5; i++) {
        const preview_URL = URL.createObjectURL(files[i]);
        tmpFileList.push({
          fileObject: files[i],
          preview_URL: preview_URL,
        });
      }
    }
    setFileList([...tmpFileList, ...fileList]);
  };

  const deleteImage = (index) => {
    const tmpFileList = [...fileList];
    tmpFileList.splice(index, 1);
    setFileList(tmpFileList);
  }

  const moveImage = (fromIndex, toIndex) => {
    const tmpFileList = [...fileList];
    const [removedItem] = tmpFileList.splice(fromIndex, 1);
    tmpFileList.splice(toIndex, 0, removedItem);
    setFileList(tmpFileList);
  }

  const [data, setData] = useState([]);
  const handleFileUpload = () => {
    if (fileList.length > 0) {
      const formData = new FormData();

      // 이미지
      for (let i = 0; i < fileList.length; i++) {
        formData.append("files", fileList[i].fileObject);
      }

      // 문자열
      formData.append('post', new Blob([JSON.stringify(jsonData)], {
        type: "application/json"
      }));

      axios.post('http://localhost:8080/api/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('업로드 성공:', response.data);
        navigate('/home/n1')
      })
      .catch((error) => {
        console.error('업로드 실패:', error);
      });
    } else {
      alert('이미지를 업로드하세요');
    }
  }

  useEffect(() => {
    const setRecipes = () => {
      fileList?.forEach((item) => {
        URL.revokeObjectURL(item.preview_URL);
      })

      axios.get('http://localhost:8080/api/recipe')
      .then((response) => {
        console.log(response)
        setData(response.data.response)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      });
    };
  setRecipes();
  }, []);

  return (
    <div className="uploader-wrapper">
      <div>
        {
          fileList.length < 5 && (
            <div>
              <label>이미지 선택</label>
              <input
                // id="fileInput"
                type="file" multiple={true} accept="image/*"
                onChange={saveImage}
                onClick={(e) => e.target.value = null}
                ref={refParam => inputRef = refParam}
                style={{ display: "none" }}
              />
              <button onClick={() => inputRef.click()}>
                사진 업로드
              </button>
            </div>
          )
        }
      </div>

      <div className="file-container">
        {
          fileList?.map((item, index) => (
            <div className="file-wrapper" key={index} draggable onDragStart={(e) => e.dataTransfer.setData("index", index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => moveImage(e.dataTransfer.getData("index"), index)}>
              <img src={item.preview_URL} alt="Uploaded file" />
              <div className="delete-button" onClick={() => { deleteImage(index) }}>
                <HighlightOffIcon fontSize="large" color="error" />
              </div>
            </div>
          ))
        }
      </div>

      <div>
        <label>참고 음식</label>
        <Autocomplete
          styled ={{width: '500px'}}
          disablePortal
          // id="combo-box-demo"
          options={data}
          sx={{ width: 300 }}
          value={data.find(item => item.recipeId === selectedRecipeId) || null}
          getOptionLabel={(option) => option.label} // 이 부분을 수정함
          renderInput={(params) => (
            <TextField
              {...params}
              label="Recipes"
            />
          )}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedRecipeId(newValue.recipeId);
            } else {
              setSelectedRecipeId(null);
            }
          }}
        />
      </div>
      <br />

      <div>
        <label>내용 입력</label>
        <br />
        <textarea
          name="" id="" cols="30" rows="5"
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <br />

      <div>
        <button onClick={handleFileUpload}>
          파일 업로드
        </button>
      </div>
    </div>
  );
}

export default UploadPost;