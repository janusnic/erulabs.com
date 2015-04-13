# Seandon Mooy's static blog project

My homepage! See http://seandonmooy.com !

```
http {
  proxy_cache_path /var/nginx/cache keys_zone=blog:10m levels=1:2 max_size=20m;

  gzip on;
  gzip_disable "msie6";
  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 6;
  gzip_buffers 16 8k;
  gzip_http_version 1.1;
  gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;

  server {
    proxy_cache blog;
    proxy_cache_methods GET HEAD POST PUT DELETE;
    add_header X-Proxy-Cache $upstream_cache_status;
    charset utf-8;

    location / {
      add_header Cache-Control 'public';
      expires 1w;
      proxy_cache_valid any 1w;
    }
    location ~* \.(png|otf|eot|svg|ttf|woff|woff2|gif|jpg|jpeg)$ {
      try_files $uri =404;
      expires 1w;
      add_header Cache-Control 'no-cache, no-store';
      access_log off;
      proxy_cache_valid any 1w;
    }
    location ^~ /assets/posts/ {
      try_files $uri =404;
      expires 1h;
      add_header Cache-Control 'no-cache, no-store';
      access_log off;
      proxy_cache_valid any 1h;
    }

    try_files $uri index.html;
  }
}
