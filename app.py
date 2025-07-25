from flask import Flask, render_template, request, redirect, url_for, flash
import os
import pdfplumber
import openai

# Set your OpenAI API key here or via environment variable
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', 'YOUR_OPENAI_API_KEY')
openai.api_key = OPENAI_API_KEY

# Function to extract structured data from resume text using OpenAI
def extract_resume_info(parsed_text):
    prompt = (
        "Extract the following fields from this resume text: "
        "Full Name, Email, Phone, Location, Skills, Work Experience (with company, title, period, highlights), Education (degree, university, year). "
        "Return the result as a JSON object.\n\nResume Text:\n" + parsed_text
    )
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0.2
        )
        content = response['choices'][0]['message']['content']
        return content
    except Exception as e:
        return f"Error extracting info: {e}"

# Placeholder for job matching logic using OpenAI
def match_jobs_with_resume(resume_info, preferences):
    # You can implement job matching here using OpenAI or other logic
    # For now, just return a placeholder
    return []

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
    if file and file.filename.lower().endswith('.pdf'):
        filename = file.filename
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)
        # Parse PDF with pdfplumber
        parsed_text = ''
        try:
            with pdfplumber.open(save_path) as pdf:
                for page in pdf.pages:
                    parsed_text += page.extract_text() or ''
        except Exception as e:
            flash(f'Error parsing PDF: {e}')
            return redirect(url_for('home', upload_message=f'Error parsing PDF: {e}'))
        # Use OpenAI to extract structured resume info
        resume_info = extract_resume_info(parsed_text)
        flash(f'Resume uploaded successfully: {filename}')
        return redirect(url_for('home', upload_message=f'Resume uploaded: {filename}', parsed_resume=parsed_text, resume_info=resume_info))
    flash('Upload failed or file is not a PDF')
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)