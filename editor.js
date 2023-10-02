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
}

const editor = new RichTextEditor();
