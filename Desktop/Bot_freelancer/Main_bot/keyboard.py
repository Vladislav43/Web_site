from aiogram.types import ReplyKeyboardRemove, \
    ReplyKeyboardMarkup, KeyboardButton, \
    InlineKeyboardMarkup, InlineKeyboardButton

#Language buttons

Language_bt_ua = InlineKeyboardButton('Ukraine🇺🇦', callback_data='UA_button')
Language_bt_en = InlineKeyboardButton('English🇬🇧', callback_data='EN_button')

Language_bt = InlineKeyboardMarkup(row_width = 2).add(Language_bt_ua, Language_bt_en)

Language_bt_ua1 = InlineKeyboardButton('Ukraine🇺🇦', callback_data='UA_button1')
Language_bt_en1 = InlineKeyboardButton('English🇬🇧', callback_data='EN_button1')

Language_bt1 = InlineKeyboardMarkup(row_width = 2).add(Language_bt_ua1, Language_bt_en1)


reg_en_bt = KeyboardButton('Registration📄')
reg_ua_bt = KeyboardButton('Реєстрація📄')

reg_ua_bt_reply = ReplyKeyboardMarkup(resize_keyboard=True).add(reg_ua_bt)
reg_en_bt_reply = ReplyKeyboardMarkup(resize_keyboard=True).add(reg_en_bt)

#menu buttons

findJob_ua_bt = KeyboardButton('Робота🔍')
createWork_ua_bt = KeyboardButton('Створити роботу📥')
set_ua_bt = KeyboardButton('Налаштування🧰')


menu_bt_ua = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
menu_bt_ua.add(findJob_ua_bt, createWork_ua_bt, set_ua_bt)


findJob_en_bt = KeyboardButton('Works🔍')
createWork_en_bt = KeyboardButton('Create Job📥')
set_en_bt = KeyboardButton('Settings🧰')


menu_bt_en = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
menu_bt_en.add(findJob_en_bt, createWork_en_bt, set_en_bt)

#stop buttons

stop_bt_en = KeyboardButton('Stop❌')
stop_bt_ua = KeyboardButton('Стоп❌')

stop_en = ReplyKeyboardMarkup(resize_keyboard=True).add(stop_bt_en)
stop_ua = ReplyKeyboardMarkup(resize_keyboard=True).add(stop_bt_ua)

#qualification buttons

python = KeyboardButton("Python")
photoshop = KeyboardButton("Photo shop")
stop_bt_en = KeyboardButton('Stop❌')

qualification_buttons = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True).add(python, photoshop, stop_bt_en)