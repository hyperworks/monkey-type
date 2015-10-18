FROM buildpack-deps:jessie

ENV RUBY_VERSION 2.1.3

RUN sed -i "s/http.debian.net/ftp.th.debian.org/" /etc/apt/sources.list

# some of ruby's build scripts are written in ruby
# we purge this later to make sure our final image uses what we just built
RUN apt-get update
RUN apt-get update --fix-missing
RUN echo nameserver 8.8.8.8 > /etc/resolv.conf

RUN unset GEM_HOME
RUN gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
RUN curl -sSL https://get.rvm.io | bash -s stable


RUN /bin/bash -l -c "rvm requirements"
RUN /bin/bash -l -c "rvm install 2.1.3"
RUN /bin/bash -l -c "rvm use 2.1.3"
RUN /bin/bash -l -c "gem install bundler"

#RUN rvm install 2.1.3
#RUN rvm use 2.1.3
#RUN gem install bundler

RUN mkdir -p /typingjs

ENV BUILD_VERSION 1

ADD . /typingjs

WORKDIR /typingjs

#RUN bundle install
RUN /bin/bash -l -c "bundle install"

#RUN source /etc/profile.d/rvm.sh

CMD /bin/bash -l -c "ruby download_file.rb"

