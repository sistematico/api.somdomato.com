output.icecast(%vorbis,
  host = "localhost",
  port = 8000,
  password = "hackme",
  mount = "/geral",
  name = "Radio Som do Mato",
  description = "A mais sertaneja!",
  genre = "Sertanejo",
  icy_metadata="true",
  mksafe(radio))
  