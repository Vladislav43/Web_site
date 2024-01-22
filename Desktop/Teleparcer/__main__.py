from telethon.sync import TelegramClient, events


api_id = 28663471
api_hash = 'f315db0466cf8237881a2f9d905a481b'
client = TelegramClient('session', api_id, api_hash)
client.start()

chat_id = [-1001261717279, -1001389304944, -1001767929813]
chanal = -1001767929813

async def checking_id():
	async for dialog in client.iter_dialogs():
		print(dialog.name, 'has ID', dialog.id)

@client.on(events.NewMessage(chats = (chat_id)))
async def parsing(event):
	print(event.message.to_dict()['message'])

def run():
	with client:
		print("Everything is working now")
		client.run_until_disconnected()

run()