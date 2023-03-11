output.icecast(%mp3
  (bitrate=128, samplerate=44100, id3v2=true),
  host = "localhost",
  port = 8000,
  password = "hackme",
  mount = "/geral",
  name = "Radio Som do Mato",
  description = "A mais sertaneja!",
  genre = "Sertanejo",
  icy_metadata="true",
  mksafe(radio))