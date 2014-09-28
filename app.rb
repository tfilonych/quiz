require 'sinatra'
require 'sinatra/activerecord'
require 'json'

set :database, 'sqlite3:./db/quiz.db'

class User < ActiveRecord::Base
end

get '*/js/:filename' do
  content_type 'application/javascript'
  send_file "public/js/#{params[:filename]}"
end

get '/' do
  send_file 'public/index.html'
end

post '/register' do
  data = JSON.parse request.body.read
  user = User.new
  user.username = data['username'] 
  user.first_name = data['first_name']
  user.last_name = data['last_name']
  user.hashed_password = data['password']
  user.email = data['email']
  user.birthday = data['birthday']
  user.plast_hovel = data['plast_hovel']
  user.plast_region = data['plast_region']
  user.plast_level = data['plast_level']
  user.picture = data['picture']
  user.save
  return [200, "ok"]
end

post '/login' do
  data = JSON.parse request.body.read
  user = User.where(username: data['username'], hashed_password: data['password']).first 
  if !user.nil?
    return [200, "ok"]
  end
    return [401, "unauthorized"]
end

not_found do
  send_file 'public/index.html'
end
