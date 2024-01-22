from aiogram import Bot, types
from aiogram.dispatcher import Dispatcher
from aiogram.utils import executor
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup


from Token import Token

from keyboard import Language_bt, menu_bt_ua, menu_bt_en, Language_bt1, stop_en, stop_ua, qualification_buttons, reg_ua_bt_reply, reg_en_bt_reply

#DataBace
import sqlite3

db = sqlite3.connect('dataBase/userDataBase')
sql = db.cursor()
storage = MemoryStorage()

sql.execute("""CREATE TABLE IF NOT EXISTS user_language(
	userID TEXT,
	language INT
	)""")
db.commit()

sql.execute("""CREATE TABLE IF NOT EXISTS user_register(
	full_name TEXT,
	age TEXT,
	description TEXT,
	qualification TEXT,
	userID TEXT
	)""")
db.commit()

def auto_filling_base(full_name, age, description, qualification, userid):
	sql.execute(f"SELECT full_name FROM user_register WHERE full_name = '{full_name}'")
	if sql.fetchone() is None:
		sql.execute(f"INSERT INTO user_register VALUES (?, ?, ?, ?, ?)", (full_name, age, description, qualification, userid))
		db.commit()


bot = Bot(token = Token)
dp = Dispatcher(bot, storage = storage)

#/start /help commands
@dp.message_handler(commands=['start'])
async def start_command(message: types.Message):
	#language data base
	userid = message.from_user.id
	language = None
	print(userid)
	sql.execute(f"SELECT userID FROM user_language WHERE userID = '{userid}'")
	if sql.fetchone() is None:
		sql.execute(f"INSERT INTO user_language VALUES (?, ?)", (userid, language))
		db.commit()
		await message.reply("Hello, please choose language", reply_markup = Language_bt)
	else:
		sql.execute(f"SELECT * FROM user_register")
		if sql.fetchone() is None:
			for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
				if i[0] == 1:		
					await message.reply("Зареєструйся!")
				elif i[1] == 2:
					await message.reply("You should sign up!")
		else:
			for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
				print(i[0])
				if i[0] == None:
					await message.answer("Sorry, you should choose language", reply_markup = Language_bt)
				elif i[0] == 1:
					await message.answer("Привіт, мене звати Вовка, я тобі допоможу знайти роботу!", reply_markup = menu_bt_en)
				elif i[0] == 2:
					await message.answer("Hello, my name is Vovka, I will help you find a job!", reply_markup = menu_bt_ua)

@dp.message_handler(commands=['change_language'])
async def change_language_command(message: types.Message):
	userid = message.from_user.id
	await message.answer("Choose language:", reply_markup = Language_bt1)

@dp.callback_query_handler(text = "UA_button1")
async def callback(callback_query: types.CallbackQuery):
	userid = callback_query.from_user.id

	for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
		if i[0] == 1:
			await callback_query.message.answer("Ти не можеш змінити мову якою ти користуєшся")
		else:
			language = 1
			sql.execute(f'UPDATE user_language SET language = {language} WHERE userID = "{userid}"')
			db.commit()
			await callback_query.answer("Українська вибрана")
			await callback_query.message.answer("Мова змінена на українську!")
			sql.execute(f"SELECT * FROM user_register")
			if sql.fetchone() is None:
				for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
					if i[0] == 1:		
						await callback_query.message.reply("Зареєструйся!", reply_markup = reg_ua_bt_reply)
					elif i[0] == 2:
						await callback_query.message.reply("You should sign up!", reply_markup = reg_en_bt_reply)
			else:
				await callback_query.message.answer("Що далі?", reply_markup = menu_bt_ua)

@dp.callback_query_handler(text = "EN_button1")
async def callback(callback_query: types.CallbackQuery):
	userid = callback_query.from_user.id
	for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
		if i[0] == 2:
			await callback_query.message.answer("You can't change language, becouse this language is useing now")
		else:
			language = 2
			sql.execute(f'UPDATE user_language SET language = {language} WHERE userID = "{userid}"')
			db.commit()
			await callback_query.answer("English chosen")
			await callback_query.message.answer("Language is changed on english!")
			sql.execute(f"SELECT * FROM user_register")
			if sql.fetchone() is None:
				for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
					if i[0] == 1:		
						await callback_query.message.reply("Зареєструйся!", reply_markup = reg_ua_bt_reply)
					elif i[0] == 2:
						await callback_query.message.reply("You should sign up!", reply_markup = reg_en_bt_reply)
			else:
				await callback_query.message.answer("What next?", reply_markup = menu_bt_en)

#Inline buttons
@dp.callback_query_handler(text = "UA_button")
async def callback(callback_query: types.CallbackQuery):
	userid = callback_query.from_user.id
	for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
		if i[0] == 1:
			await callback_query.message.answer("Ти можеш змінити мову командою /change_language")
		elif i[0] == 2:
			await callback_query.message.answer("If you want to change language, write /change_language")
		else:
			language = 1
			sql.execute(f'UPDATE user_language SET language = {language} WHERE userID = "{userid}"')
			db.commit()
			await callback_query.answer("Українська вибрана")
			await callback_query.message.answer("Тепер я буду розмовляти українською!")
			await callback_query.message.answer("Привіт, мене звати Вовка, я тобі допоможу знайти роботу!", reply_markup = reg_ua_bt_reply)

@dp.callback_query_handler(text = "EN_button")
async def callback(callback_query: types.CallbackQuery):
	userid = callback_query.from_user.id
	for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
		if i[0] == 2:
			await callback_query.message.answer("If you want to change language, write /change_language")
		elif i[0] == 1:
			await callback_query.message.answer("Ти можеш змінити мову командою /change_language")
		else:
			language = 2
			sql.execute(f'UPDATE user_language SET language = {language} WHERE userID = "{userid}"')
			db.commit()
			await callback_query.answer("English chosen")
			await callback_query.message.answer("Now I'll speck english!")
			await callback_query.message.answer("Hello, my name is Vovka, I will help you find a job!", reply_markup = reg_en_bt_reply)


#registration
class FSMreg(StatesGroup):
	full_name = State()
	age = State()
	description = State()
	qualification = State()

@dp.message_handler(state = None)
async def registration_command(message: types.Message):
	if message.text == "Реєстрація📄" or message.text == "Registration📄":
		userid = message.from_user.id
		await FSMreg.full_name.set()
		print(f"registration_start {userid}")
		for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
			print(i[0])
			if i[0] == 1:
				await message.reply("Добре, почнемо реєстрацію\n\nНапишіть ваше повне ім'я:", reply_markup = stop_ua)
			elif i[0] == 2:
				await message.reply("Ok, let's sign up\n\nWrite full name:", reply_markup = stop_en)

	@dp.message_handler(state = FSMreg.full_name)
	async def load_fullName(message: types.Message, state: FSMreg):
		userid = message.from_user.id
		async with state.proxy() as data:
			data['full_name'] = message.text
			if data['full_name'] == "Stop❌" or data['full_name'] == "Стоп❌":
				sql.execute(f"SELECT * FROM user_register")
				if sql.fetchone() is None:
					for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
						if i[0] == 1:		
							await message.reply("Реєстрацію примусово закінчено", reply_markup = reg_ua_bt_reply)
							await state.finish()
						elif i[0] == 2:
							await message.reply("Registration is stoped", reply_markup = reg_en_bt_reply)
							await state.finish()
				else:
					for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):#Брат, я довбойоб лінивий, цей код не треба, але не трогай його
						if i[0] == 1:#Брат, я довбойоб лінивий, цей код не треба, але не трогай його
							await message.reply("Реєстрацію примусово закінчено", reply_markup = menu_bt_ua)#Брат, я довбойоб лінивий, цей код не треба, але не трогай його
						elif i[0] == 2:#Брат, я довбойоб лінивий, цей код не треба, але не трогай його
							await message.reply("Registration is stoped", reply_markup = menu_bt_en)#Брат, я довбойоб лінивий, цей код не треба, але не трогай його
					await state.finish()#Брат, я довбойоб лінивий, цей код не треба, але не трогай його
			else:
				await FSMreg.next()
				for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
					if i[0] == 1:
						await message.reply("Напишіть ваш вік:")
					elif i[0] == 2:
						await message.reply("Write your age:")


	@dp.message_handler(state = FSMreg.age)
	async def load_age(message: types.Message, state: FSMreg):
		userid = message.from_user.id
		async with state.proxy() as data:
			message_from_user = message.text
			if message_from_user == "Stop❌" or message_from_user == "Стоп❌":
				sql.execute(f"SELECT * FROM user_register")
				if sql.fetchone() is None:
					for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
						if i[0] == 1:		
							await message.reply("Реєстрацію примусово закінчено", reply_markup = reg_ua_bt_reply)
							await state.finish()
						elif i[0] == 2:
							await message.reply("Registration is stoped", reply_markup = reg_en_bt_reply)
							await state.finish()
				else:
					for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):#Брат, я довбойоб лінивий, цей код не треба, але не трогай його
						if i[0] == 1:#Брат, я довбойоб лінивий, цей код не треба, але не трогай його
							await message.reply("Реєстрацію примусово закінчено", reply_markup = menu_bt_ua)#Брат, я довбойоб лінивий, цей код не треба, але не трогай його
						elif i[0] == 2:#Брат, я довбойоб лінивий, цей код не треба, але не трогай його
							await message.reply("Registration is stoped", reply_markup = menu_bt_en)#Брат, я довбойоб лінивий, цей код не треба, але не трогай його
					await state.finish()#Брат, я довбойоб лінивий, цей код не треба, але не трогай його
			else:
				try:
					message_from_user = int(message_from_user)
					message_from_user_correct = int(message_from_user)
					print(message_from_user)
				except:
					pass
				message_from_user = type(message_from_user)
				print(message_from_user)
				if message_from_user == int:
					data['age'] = message_from_user_correct
					await FSMreg.next()
					for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
						if i[0] == 1:
							await message.reply("Напишіть опис про вас:")
						elif i[0] == 2:
							await message.reply("Write description about yourself:")
				else:
					for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
						if i[0] == 1:
							await message.reply("Введіть коректну цифру")
							await message.answer("Спробуйте ще раз")
							await state.finish()
						elif i[0] == 2:
							await message.reply("Write correct number")
							await state.finish()
							await message.answer("Try again")

	@dp.message_handler(state = FSMreg.description)
	async def description(message: types.Message, state: FSMreg):
		userid = message.from_user.id
		async with state.proxy() as data:
			data['description'] = message.text
			print(data['description'])
			if data['description'] == "Stop❌" or data['full_name'] == "Стоп❌":
				sql.execute(f"SELECT * FROM user_register")
				if sql.fetchone() is None:
					for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
						if i[0] == 1:		
							await message.reply("Реєстрацію примусово закінчено", reply_markup = reg_ua_bt_reply)
							await state.finish()
						elif i[0] == 2:
							await message.reply("Registration is stoped", reply_markup = reg_en_bt_reply)
							await state.finish()
				else:
					for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
						if i[0] == 1:
							await message.reply("Реєстрацію примусово закінчено", reply_markup = menu_bt_ua)
						elif i[0] == 2:
							await message.reply("Registration is stoped", reply_markup = menu_bt_en)
					await state.finish()
			else:
				await FSMreg.next()
				for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
					if i[0] == 1:
						await message.reply("Додайте вашу кваліфікацію:", reply_markup = qualification_buttons)
					elif i[0] == 2:
						await message.reply("Add your qualification:", reply_markup = qualification_buttons)


	@dp.message_handler(state = FSMreg.qualification)
	async def qualification(message: types.Message, state: FSMreg):
		userid = message.from_user.id
		async with state.proxy() as data:
			data['qualification'] = message.text
		if message.text != 'Stop❌':
			async with state.proxy() as data:
				full_name = str(data['full_name'])
				age = str(data['age'])
				description = str(data['description'])
				qualification = str(data['qualification'])
				for i in sql.execute(f"SELECT language FROM user_language WHERE userID = '{userid}'"):
					if i[0] == 1:
						auto_filling_base(full_name, age, description, qualification, userid)
						for i in sql.execute(f"SELECT * FROM user_register"):
							print(i)
						await message.reply("Регестрація завершена", reply_markup = menu_bt_ua)
					elif i[0] == 2:
						auto_filling_base(full_name, age, description, qualification, userid)
						for i in sql.execute(f"SELECT * FROM user_register"):
							print(i)
						await message.reply("Registration is over, sucesfully", reply_markup = menu_bt_en)
			await state.finish()




if __name__ == '__main__':
    executor.start_polling(dp)