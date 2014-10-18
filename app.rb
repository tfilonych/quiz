require 'sinatra'
require 'sinatra/activerecord'
require 'json'

set :database, 'sqlite3:./db/quiz.db'
Dir['./models/*.rb'].each {|file| require file}
enable :sessions
set :session_secret, 'cca369ff55af5ceefc50939498d93f5905272422baf5d86dd0c4271e2e68a9ba'

get '*/js/:filename' do
  content_type 'application/javascript'
  send_file "public/js/#{params[:filename]}"
end

get '/' do
  send_file 'public/index.html'
end

get '/session' do
  return session.inspect
end

post '/user' do
  data = JSON.parse request.body.read
  user = User.new(data)
  if user.save
    return [200, "ok"]
  else
    return [400, user.errors.messages.to_json]
  end
end

put '/user' do
  data = JSON.parse request.body.read
  filter = %w(first_name last_name email birthday plast_level plast_region plast_hovel picture)
  data.delete_if{|key, value| !filter.include? key}
  user = User.find(session[:user_id])
  data.each{|key, value| user.send("#{key}=", value)}
  if user.save
    return [200, 'ok']
  else
    return [400, 'bad request']
  end
end

get '/access' do
  if session[:user_id]
    user = User.find(session[:user_id])
    return [200, user.attributes.to_json]
  end
  return [401, "unauthorized"]
end

post '/access' do
  data = JSON.parse request.body.read
  user = User.authenticate(data['username'], data['password'])
  if !user.nil?
     session[:user_id] = user.id
    return [200, user.attributes.to_json]
  end
    return [401, "unauthorized"]
end

delete '/access' do
  session.clear
  return [200, "ok"]
end

post '/avatar' do
  if session[:user_id]
    user = User.find(session[:user_id])
    tempfile = params[:file][:tempfile]
    filename = params[:file][:filename]
    saved_name = "#{user.username}#{File.extname(filename)}"
    FileUtils.copy(tempfile.path, "public/img/ava/#{saved_name}")
    return [200, saved_name]
  end
  return [401, "unauthorized"]
end

not_found do
  send_file 'public/index.html'
end
