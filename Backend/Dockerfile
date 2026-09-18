FROM python:3.13-slim

WORKDIR /app

COPY Backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libopencv-dev \
    && rm -rf /var/lib/apt/lists/*

COPY Backend/ .

# Copy OpenCV Haar cascade files into the location used by cv2.data.haarcascades
RUN mkdir -p /usr/local/lib/python3.13/site-packages/cv2/data && \
    cp /usr/share/opencv4/haarcascades/*.xml /usr/local/lib/python3.13/site-packages/cv2/data/

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]