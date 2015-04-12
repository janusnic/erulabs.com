# Seandon Mooy's static blog project

My homepage! See http://seandonmooy.com !

```
http {
  proxy_cache_path /var/nginx/cache keys_zone=blog:20m levels=1:2 max_size=40m;

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
    location /assets {
      try_files $uri $uri/ =404;
      expires 1h;
      add_header Cache-Control "public";
      access_log off;
      proxy_cache_valid any 1h;
    }
    location / {
      expires -1;
      proxy_cache_valid any 5m;
    }
    try_files $uri index.html;
  }
}
