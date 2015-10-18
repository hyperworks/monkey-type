require 'readability'
require 'open-uri'
require 'sanitize'
require 'ffi-icu'
require 'sinatra'
require 'json'

set :bind, '0.0.0.0'

def download_file(url)
	source = open(url).read
	html = Readability::Document.new(source).content
	out = Sanitize.fragment(html)
	out.gsub!(/[(,?!\'":.)]/, '').gsub(' ', '-').gsub(/-$/, '') #remove punctuation

	#optionally remove latin charecters for thai lists
	out.gsub!(/[a-zA-Z]/,"")
	puts out


	puts "------"
	iterator = ICU::BreakIterator.new(:word, "th_TH")
	iterator.text = out
	words = iterator.each_substring.reject do |c|
	 c.empty?  || c == "\n" || c == "\t" || c == " "
	end
	count = 0
	output = "["
	JSON.generate(words)
end

#'http://news.sanook.com/1768489/'

get '/article/' do
   download_file(params[:url])
end