class RichTextEditor {
  constructor() {
    this.boldButton = document.getElementById("bold");
    this.italicButton = document.getElementById("italic");
    this.underlineButton = document.getElementById("underline");
    this.alignLeft = document.getElementById("align-left");
    this.alignCenter = document.getElementById("align-center");
    this.alignRight = document.getElementById("align-right");
    this.alignJustify = document.getElementById("align-justify");
    this.imageUpload = document.getElementById("image-upload");
    this.undoButton = document.getElementById("undo");
    this.redoButton = document.getElementById("redo");
    this.saveButton = document.getElementById("save");
    this.downloadLink = document.getElementById("download");
    this.editor = document.getElementById("editor");

    this.undoStack = [];
    this.redoStack = [];

    this.boldButton.addEventListener("click", () => this.execCommand("bold"));
    this.italicButton.addEventListener("click", () =>
      this.execCommand("italic")
    );
    this.underlineButton.addEventListener("click", () =>
      this.execCommand("underline")
    );
    this.alignLeft.addEventListener("click", () => this.alignText("Left"));
    this.alignCenter.addEventListener("click", () => this.alignText("Center"));
    this.alignRight.addEventListener("click", () => this.alignText("Right"));
    this.alignJustify.addEventListener("click", () => this.alignText("Full"));
    this.imageUpload.addEventListener("change", (e) =>
      this.insertImage(e.target.files)
    );
    this.undoButton.addEventListener("click", () => this.undo());
    this.redoButton.addEventListener("click", () => this.redo());
    this.saveButton.addEventListener("click", () => this.save());
    this.editor.addEventListener("input", () => this.updateStack());

    this.fileNameElement = document.getElementById("file-name");
    this.fileName = "Untitled"; // Initial file name

    document.getElementById("new-file").addEventListener("click", () => this.newFile());
    document.getElementById("open-file").addEventListener("click", () => this.openFile());
    document.getElementById("recent-file").addEventListener("click", () => this.recentFile());
    document.getElementById("export-file").addEventListener("click", () => this.exportFile());
    document.getElementById("share-file").addEventListener("click", () => this.shareFile());
    this.editor.addEventListener("input", () => this.updateStack());
  }

  execCommand(command) {
    document.execCommand(command, false, null);
  }

  alignText(command) {
    this.execCommand(`justify${command}`);
  }

  insertImage(files) {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        this.editor.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  }

  undo() {
    if (this.undoStack.length > 0) {
      const state = this.undoStack.pop();
      this.redoStack.push(this.editor.innerHTML);
      this.editor.innerHTML = state;
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.undoStack.push(this.editor.innerHTML);
      this.editor.innerHTML = state;
    }
  }

  updateStack() {
    this.undoStack.push(this.editor.innerHTML);
    this.redoStack.length = 0;
  }

  save() {
    const content = this.editor.innerHTML;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    this.downloadLink.href = url;
    this.downloadLink.style.display = "block";
  }

  newFile() {
    // Clear the editor content for a new file
    this.editor.innerHTML = '';
    
    // Reset the undo and redo stacks
    this.undoStack = [];
    this.redoStack = [];

    // Update the stack for the new state
    this.updateStack();

    // Set the file name to "Untitled"
    this.setFileName("Untitled");
  }

  setFileName(name) {
    this.fileName = name;
    this.fileNameElement.textContent = this.fileName;
  }

  openFile() {
    // Trigger a file input click to open the file dialog
    this.imageUpload.click();
  
    // Listen for the file input change event
    this.imageUpload.addEventListener("change", (e) => {
      const files = e.target.files;
  
      // Check if there are selected files
      if (files.length > 0) {
        const file = files[0];
        
        // Check the file type
        if (file.type === "application/msword" || file.name.endsWith(".doc")) {
          const reader = new FileReader();
  
          // Read the content of the file
          reader.onload = (event) => {
            const fileContent = event.target.result;
  
            // Set the content of the editor to the file content
            this.editor.innerHTML = fileContent;
  
            // Update the undo stack for the new state
            this.updateStack();
  
            // Set the file name (you can extract it from the file object)
            this.setFileName(file.name);
          };
  
          // Read the file as text
          reader.readAsText(file);
        } else {
          alert("Please select a valid .doc file.");
        }
      }
    });
  }

  saveFile() {
    // Save the current content with the existing file name
    // For simplicity, you can use the Blob and createObjectURL method
    const content = this.editor.innerHTML;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    this.downloadLink.href = url;
    this.downloadLink.style.display = "none"; // Hide the download link

    // Update the undo stack for the current state
    this.updateStack();
  }

  saveAsFile() {
    // Show a prompt to get the new file name
    const newFileName = prompt("Enter a new file name:", "document.html");

    if (newFileName !== null) {
      // Save the current content with the new file name
      this.setFileName(newFileName);
      this.saveFile();
    }
  }

  recentFile() {
    // Simulate displaying a list of recent files in a modal
    alert("Displaying a list of recent files...\n1. Document1.txt\n2. Document2.txt\n3. Document3.txt");
  }

  exportFile() {
    // Trigger the click event on the download link to download the file
    this.downloadLink.click();
  }

  shareFile() {
    // Simulate showing a modal with sharing options
    const shareModal = document.createElement("div");
    shareModal.innerHTML = `
      <h2>Share File</h2>
      <p>Share the file using the following options:</p>
      <button onclick="alert('Share via email')">Email</button>
      <button onclick="alert('Share via link')">Copy Link</button>
    `;
    document.body.appendChild(shareModal);
  }
}

const editor = new RichTextEditor();


