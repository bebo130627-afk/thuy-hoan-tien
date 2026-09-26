# Thủy Hoàn Tiền — Shopee API v1

Bản này là bước 1: tạo link Shopee thật qua API phía server Vercel.

## Vercel Environment Variable

Tạo Secret:

`ADDLIVETAG_API_KEY`

Không đưa API key vào `index.html`, JavaScript frontend hoặc GitHub.

## Deploy

Upload toàn bộ thư mục này vào project Vercel `thuy_hoan_tien_`, sau đó Redeploy Production.

## Test

Mở website, dán một URL Shopee Việt Nam và bấm `Tạo link hoàn tiền`.

SubID hiện là demo. Ở bước tiếp theo sẽ thay bằng SubID duy nhất của từng tài khoản khách hàng và lưu vào database.
