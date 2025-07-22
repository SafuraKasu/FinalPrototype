from flask import Flask, render_template, request, redirect, url_for, flash
import os

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Needed for flashing messages
UPLOAD_FOLDER = os.path.join('static', 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=['GET'])
def home():
    upload_message = request.args.get('upload_message')
    return render_template('index.html', upload_message=upload_message)

@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    if 'resumeFile' not in request.files:
        flash('No file part')
        return redirect(url_for('home'))
    file = request.files['resumeFile']
    if file.filename == '':
        flash('No selected file')
        return redirect(url_for('home'))
    if file:
        filename = file.filename
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)
        flash(f'Resume uploaded successfully: {filename}')
        return redirect(url_for('home', upload_message=f'Resume uploaded: {filename}'))
    flash('Upload failed')
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)