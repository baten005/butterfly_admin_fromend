import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../AxiosInstance/axiosinstance";
import imageCompression from "browser-image-compression";
import "../Styles/note.css";
import ImageResize from 'quill-image-resize';
Quill.register('modules/imageResize', ImageResize);

const Note = (props) => {
  const [suggestionText, setSuggestionText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const quillRef = useRef(null);

  useEffect(() => {
    if (props.userId) {
      fetchSuggestion(props.userId);
    }
  }, [props.userId]);

  const fetchSuggestion = async (userId) => {
    try {
      const response = await axiosInstance.get(`/suggestions/${userId}`);
      setSuggestionText(response.data.suggestion || "");
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    }
  };

  const handleEditorChange = (value) => {
    setSuggestionText(value);
  };

  const saveSuggestion = async () => {
    setIsSaving(true);
    try {
      const editor = quillRef.current.getEditor();
      const content = editor.root.innerHTML;

      //console.log(content)

      await axiosInstance.post("/suggestions", {
        suggestion: content,
        userId: props.userId,
      });
      
      toast.success("Suggestion saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error saving suggestion:", error);
      toast.error("Failed to save suggestion.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const closeEditor = () => {
    props.setShowNote && props.setShowNote(false);
  };

  const imageHandler = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      setIsUploading(true);
      const file = input.files[0];
      if (file) {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1080,
          useWebWorker: true,
        };
        try {
          const compressedFile = await imageCompression(file, options);
          const base64Image = await imageCompression.getDataUrlFromFile(compressedFile);

          const editor = quillRef.current.getEditor();
          editor.focus();

          let range = editor.getSelection();
          if (!range || range.index === null || range.index === undefined) {
            range = { index: editor.getLength(), length: 0 };
          }

          editor.insertEmbed(range.index, "image", base64Image);
          editor.setSelection(range.index + 1);
        } catch (error) {
          console.error("Error handling image:", error);
        } finally {
          setIsUploading(false);
        }
      }
    };
  }, []);

  const quillModules = {
    toolbar: {
      container: [
        [{ font: [] }, { size: [] }],
        [{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6] }, { header: false }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link", "image", "video"],
        ["code-block", "blockquote"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    //imageResize: {
    //  modules: ["Resize", "DisplaySize", "Toolbar"],
    //},
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
    "blockquote",
  ];

  return (
    <div>
      <Modal
        isOpen={props.showNote}
        onRequestClose={closeEditor}
        contentLabel="Suggestion Editor"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div
          className={`editor-container ${isUploading ? "loading-cursor" : ""}`}
          style={{ maxHeight: "70vh", overflowY: "scroll", padding: "10px", position: "relative" }}
        >
          <ReactQuill
            ref={quillRef}
            value={suggestionText}
            onChange={handleEditorChange}
            placeholder="Type your suggestion here..."
            modules={quillModules}
            formats={quillFormats}
          />
        </div>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={saveSuggestion}
            disabled={isSaving}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: isSaving ? "not-allowed" : "pointer",
              marginRight: "10px",
            }}
          >
            {isUploading && (
              <div className="upload-indicator">
                <span>Uploading...</span>
              </div>
            )}
            {!isUploading ? (isSaving ? "Saving..." : "Save") : ""}
          </button>
          <button
            onClick={closeEditor}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Note;
