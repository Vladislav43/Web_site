from pypdf import PdfReader
from gtts import gTTS
import time
import os

import sqlite3

class Parcer:
	def __init__(self):
		file_name = "Лекція_01Вступ.pdf"
		self.file = PdfReader(f"lection/{file_name}")

	def number_of_pages(self):
		number_of_pages = len(self.file.pages)
		return number_of_pages

	def parsing(self, pages):
		self.page = self.file.pages[pages]
		text = self.page.extract_text()
		return text

	def run(self):
		num_of_pages = Parcer().number_of_pages()
		self.run = ""
		print(num_of_pages)
		for i in range(num_of_pages):
			self.run = Parcer().parsing((0, num_of_pages))
			print(i)
			print(self.run)
			lect_num
			tts = gTTS(self.run, lang = "uk")
			tts.save(f"lect1.mp3")

Parcer().run()