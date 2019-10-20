install:
	python -m venv venv && . ./venv/bin/activate && pip3 install -r requirements.txt

run:
	cd bin && ./pyserver