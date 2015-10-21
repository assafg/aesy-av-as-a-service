#! /bin/bash
cd /vagrant
docker run -d --name clamserver dinkel/clamavd
docker run -it --rm -v "$PWD":/usr/src/myapp -w /usr/src/myapp node npm install
docker run -it --rm --link clamserver:clamserver -p 8000:3000 -v "$PWD":/usr/src/myapp -w /usr/src/myapp node npm start
