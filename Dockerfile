FROM node:18-alpine AS builder
WORKDIR /app

# Paketleri kopyala ve yükle
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Kaynak kodları kopyala ve build et
COPY . .
RUN npm run build

# Üretim aşaması
FROM node:18-alpine AS runner
WORKDIR /app

# Üretim modunu ayarla
ENV NODE_ENV=production

# Sistem kullanıcısı oluştur
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Build çıktılarını ve gerekli dosyaları kopyala
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Kullanıcı izinlerini ayarla
RUN chown -R nextjs:nodejs /app

# Sistem kullanıcısına geç
USER nextjs

# Port ve host ayarları
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Coolify ayarı
ENV COOLIFY=true

# Uygulamayı başlat
CMD ["node", "server.js"]