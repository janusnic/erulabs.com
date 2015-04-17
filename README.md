# Seandon Mooy's static blog project

My homepage! See http://seandonmooy.com !


todos:
  GA
  Disqus
  twitter/facebook icons on blog posts
  - write two posts
  - migrate drupal post


```
server {
  charset utf-8;
  etag on;
  expires 1w;

  location ~* \.(png|otf|eot|svg|ttf|woff|woff2|gif|jpg|jpeg|js|css)$ {
    add_header Cache-Control 'public';
    access_log off;
  }
  location ^~ /assets/posts/ {
    expires 1h;
    access_log off;
  }
  location / {
    try_files $uri /index.html;
  }
}
```
