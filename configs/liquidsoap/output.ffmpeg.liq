output.icecast(
  %ffmpeg(format="mp3", %audio(codec="libmp3lame", b="128k")), 
  mount="/geral",
  host="localhost", 
  port=8000,
  password="hackme",
  name = "Radio Som do Mato",
  description = "A mais sertaneja!",
  genre = "Sertanejo",  
  mksafe(radio))