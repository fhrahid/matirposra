"""Capture screenshots of the Matir Poshara app for the CSE471 report."""
import json
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
OUT = Path(__file__).parent / "screenshots"
OUT.mkdir(exist_ok=True)

PRODUCT_ID = "6a26ef3df0d4778c1cf6a383"
DEMO_EMAIL = "demo@matirposhara.com"
DEMO_PASS = "demo1234"

CART = [{"id": PRODUCT_ID, "name": "হস্তশিল্প মাটির হাঁড়ি", "price": 450, "qty": 2, "icon": "🏺"}]


def shot(page, name, full=False):
    page.wait_for_timeout(1400)
    page.screenshot(path=str(OUT / f"{name}.png"), full_page=full)
    print("captured", name)


def main():
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        ctx = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
        page = ctx.new_page()

        # ---------- CUSTOMER PAGES ----------
        page.goto(BASE, wait_until="networkidle")
        shot(page, "01_home")
        shot(page, "01b_home_full", full=True)

        # Register page (fill form for a representative screenshot, do not submit)
        page.goto(f"{BASE}/register", wait_until="networkidle")
        try:
            inputs = page.locator("input")
            page.fill('input[name="name"]', "Demo Customer") if page.locator('input[name="name"]').count() else None
        except Exception:
            pass
        shot(page, "02_register")

        # Login page + actually log in the demo user
        page.goto(f"{BASE}/login", wait_until="networkidle")
        try:
            page.fill('input[type="email"]', DEMO_EMAIL)
            page.fill('input[type="password"]', DEMO_PASS)
        except Exception as e:
            print("login fill err", e)
        shot(page, "03_login")
        try:
            page.click('button[type="submit"]')
            page.wait_for_timeout(2500)
        except Exception as e:
            print("login submit err", e)

        # Account page (should be logged in now)
        page.goto(f"{BASE}/account", wait_until="networkidle")
        shot(page, "04_account")

        # Search
        page.goto(f"{BASE}/search?q=মাটি", wait_until="networkidle")
        shot(page, "05_search")

        # Category
        page.goto(f"{BASE}/category/kitchen", wait_until="networkidle")
        shot(page, "06_category")

        # Product detail
        page.goto(f"{BASE}/product/{PRODUCT_ID}", wait_until="networkidle")
        shot(page, "07_product")

        # Offers
        page.goto(f"{BASE}/offers", wait_until="networkidle")
        shot(page, "08_offers")

        # Seed cart then checkout
        page.goto(BASE, wait_until="networkidle")
        page.evaluate("(c) => localStorage.setItem('matir_poshara_cart', JSON.stringify(c))", CART)
        page.goto(f"{BASE}/checkout", wait_until="networkidle")
        shot(page, "09_checkout")

        # ---------- ADMIN PAGES ----------
        # Admin login screenshot
        page.goto(f"{BASE}/admin/login", wait_until="networkidle")
        try:
            page.fill('input[type="password"]', "admin123")
        except Exception:
            pass
        shot(page, "10_admin_login")

        # Authenticate admin via localStorage for the rest
        ctx.add_init_script("localStorage.setItem('admin_auth','true')")
        page.goto(f"{BASE}/admin", wait_until="networkidle")
        page.wait_for_timeout(800)
        shot(page, "11_admin_dashboard")

        page.goto(f"{BASE}/admin/products", wait_until="networkidle")
        page.wait_for_timeout(1000)
        shot(page, "12_admin_products")

        # Open the add-product modal
        try:
            btn = page.get_by_role("button", name=lambda n: n and ("নতুন" in n or "যোগ" in n or "Add" in n))
            if btn.count():
                btn.first.click()
            else:
                page.locator("button:has-text('পণ্য')").first.click()
            page.wait_for_timeout(1000)
        except Exception as e:
            print("add modal err", e)
        shot(page, "13_admin_product_form")

        page.goto(f"{BASE}/admin/orders", wait_until="networkidle")
        page.wait_for_timeout(1000)
        shot(page, "14_admin_orders")

        page.goto(f"{BASE}/admin/artisans", wait_until="networkidle")
        page.wait_for_timeout(800)
        shot(page, "15_admin_artisans")

        page.goto(f"{BASE}/admin/settings", wait_until="networkidle")
        page.wait_for_timeout(1000)
        shot(page, "16_admin_settings")

        browser.close()
        print("ALL DONE")


if __name__ == "__main__":
    main()
