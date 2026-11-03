import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Plus,
  LogOut,
  User,
  House,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { api, ApiError } from "./adminApi";
import type { Listing } from "./data";
import "./admin.css";
type AdminUser = { id: string; name: string; email: string; role: "admin" };
type ManagedListing = Listing & { status: "draft" | "published" };
type Draft = Omit<ManagedListing, "id" | "host" | "rating" | "reviews">;
const blank = (): Draft => ({
  title: { az: "", en: "", ru: "" },
  description: { az: "", en: "", ru: "" },
  country: "AZ",
  city: "",
  area: "",
  type: "apartment",
  price: 100,
  currency: "AZN",
  guests: 2,
  bedrooms: 1,
  beds: 1,
  amenities: ["wifi", "kitchen"],
  images: ["/images/interior-1.jpg"],
  status: "draft",
});
const errorText = (error: unknown) =>
  error instanceof ApiError
    ? {
        INVALID_LOGIN: "E-poçt və ya şifrə yanlışdır.",
        UNAUTHORIZED: "Sessiya bitib. Yenidən daxil olun.",
        TOO_MANY_ATTEMPTS:
          "Çox sayda giriş cəhdi. 15 dəqiqə sonra yenidən sınayın.",
        VALIDATION:
          "Məlumatları yoxlayın. Bütün dillərdə başlıq və təsvir daxil edin.",
        ORIGIN_REJECTED:
          "Serverin APP_ORIGIN ayarı saytın ünvanına uyğun deyil.",
      }[error.code] ||
      "Server və ya MongoDB bağlantısı hazır deyil. Server konfiqurasiyasını yoxlayın."
    : "Əməliyyat tamamlanmadı. Yenidən sınayın.";
export default function Admin({
  onCatalogChange,
}: {
  onCatalogChange: () => void;
}) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<ManagedListing[]>([]);
  const [tab, setTab] = useState<"listings" | "profile">("listings");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  async function refresh() {
    const data = await api<{ listings: ManagedListing[] }>("/admin/listings");
    setItems(data.listings);
  }
  useEffect(() => {
    let active = true;
    api<{ user: AdminUser }>("/auth/me")
      .then(async (data) => {
        if (!active) return;
        setUser(data.user);
        try {
          const result = await api<{ listings: ManagedListing[] }>(
            "/admin/listings",
          );
          if (active) setItems(result.listings);
        } catch (e) {
          if (active) setError(errorText(e));
        }
      })
      .catch((e) => {
        if (active && (!(e instanceof ApiError) || e.status !== 401))
          setError(errorText(e));
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
    } catch (e) {
      setError(errorText(e));
      if (
        e instanceof ApiError &&
        e.status === 401 &&
        e.code !== "INVALID_LOGIN"
      ) {
        setUser(null);
        setDraft(null);
      }
    } finally {
      setBusy(false);
    }
  }
  function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = new FormData(e.currentTarget);
    void run(async () => {
      const data = await api<{ user: AdminUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: values.get("email"),
          password: values.get("password"),
        }),
      });
      setUser(data.user);
      await refresh();
    });
  }
  function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    void run(async () => {
      await api(`/admin/listings${editing ? `/${editing}` : ""}`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(draft),
      });
      setDraft(null);
      setEditing(null);
      await refresh();
      onCatalogChange();
      setNotice("Elan saxlanıldı. Yalnız yayımlanmış elanlar saytda görünür.");
    });
  }
  function field<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((old) => (old ? { ...old, [key]: value } : old));
  }
  return (
    <section className="admin-page container">
      <header className="admin-heading">
        <div>
          <span className="detail-eyebrow">ZZZLEP · ADMIN</span>
          <h1>İdarəetmə paneli</h1>
          <p>Elanlarınızı və admin profilinizi idarə edin.</p>
        </div>
        {user && (
          <button
            className="btn btn-outline"
            disabled={busy}
            onClick={() =>
              void run(async () => {
                await api("/auth/logout", { method: "POST" });
                setUser(null);
                setItems([]);
                setDraft(null);
              })
            }
          >
            <LogOut size={16} /> Çıxış
          </button>
        )}
      </header>
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="admin-notice">
          {notice}
        </p>
      )}
      {checking ? (
        <p role="status">Sessiya yoxlanılır…</p>
      ) : !user ? (
        <form className="admin-login admin-panel" onSubmit={login}>
          <h2>Admin girişi</h2>
          <p>Yalnız admin hesabı ilə daxil olmaq mümkündür.</p>
          <label>
            E-poçt
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
            />
          </label>
          <label>
            Şifrə
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={1024}
            />
          </label>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Gözləyin…" : "Daxil ol"}
          </button>
          <a href="#/">Sayta qayıt</a>
        </form>
      ) : (
        <>
          <nav className="admin-tabs" aria-label="Admin bölmələri">
            <button
              aria-pressed={tab === "listings"}
              onClick={() => setTab("listings")}
            >
              <House size={17} /> Elanlar
            </button>
            <button
              aria-pressed={tab === "profile"}
              onClick={() => setTab("profile")}
            >
              <User size={17} /> Profilim
            </button>
          </nav>
          {tab === "profile" ? (
            <form
              className="admin-panel admin-login"
              onSubmit={(e) => {
                e.preventDefault();
                const values = new FormData(e.currentTarget);
                void run(async () => {
                  const data = await api<{ user: AdminUser }>(
                    "/admin/profile",
                    {
                      method: "PATCH",
                      body: JSON.stringify({ name: values.get("name") }),
                    },
                  );
                  setUser(data.user);
                  setNotice("Profil yeniləndi.");
                });
              }}
            >
              <h2>Profilim</h2>
              <label>
                Ad
                <input
                  name="name"
                  defaultValue={user.name}
                  required
                  maxLength={100}
                />
              </label>
              <label>
                E-poçt
                <input value={user.email} readOnly />
              </label>
              <p>Rol: Admin</p>
              <button className="btn btn-primary" disabled={busy}>
                Profili saxla
              </button>
            </form>
          ) : (
            <>
              <div className="admin-toolbar">
                <h2>
                  Elanlar <small>({items.length})</small>
                </h2>
                <button
                  className="btn btn-primary"
                  disabled={busy}
                  onClick={() => {
                    setEditing(null);
                    setDraft(blank());
                    setError("");
                  }}
                >
                  <Plus size={17} /> Yeni elan
                </button>
              </div>
              {draft && (
                <form className="admin-panel admin-editor" onSubmit={save}>
                  <h2>{editing ? "Elanı redaktə et" : "Yeni elan yarat"}</h2>
                  <div className="admin-grid">
                    {(["az", "en", "ru"] as const).map((lang) => (
                      <div key={lang}>
                        <label>
                          Başlıq · {lang.toUpperCase()}
                          <input
                            value={draft.title[lang]}
                            onChange={(e) =>
                              field("title", {
                                ...draft.title,
                                [lang]: e.target.value,
                              })
                            }
                            required
                            maxLength={180}
                          />
                        </label>
                        <label>
                          Təsvir · {lang.toUpperCase()}
                          <textarea
                            value={draft.description[lang]}
                            onChange={(e) =>
                              field("description", {
                                ...draft.description,
                                [lang]: e.target.value,
                              })
                            }
                            required
                            maxLength={5000}
                            rows={4}
                          />
                        </label>
                      </div>
                    ))}
                    <label>
                      Ölkə
                      <select
                        value={draft.country}
                        onChange={(e) =>
                          field("country", e.target.value as Draft["country"])
                        }
                      >
                        {[
                          ["AZ", "Azərbaycan"],
                          ["TR", "Türkiyə"],
                          ["US", "ABŞ"],
                          ["IT", "İtaliya"],
                          ["JP", "Yaponiya"],
                        ].map(([id, name]) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Şəhər
                      <input
                        value={draft.city}
                        onChange={(e) => field("city", e.target.value)}
                        required
                        maxLength={200}
                      />
                    </label>
                    <label>
                      Ərazi
                      <input
                        value={draft.area}
                        onChange={(e) => field("area", e.target.value)}
                        required
                        maxLength={200}
                      />
                    </label>
                    <label>
                      Məkan növü
                      <select
                        value={draft.type}
                        onChange={(e) =>
                          field("type", e.target.value as Draft["type"])
                        }
                      >
                        {[
                          ["apartment", "Mənzil"],
                          ["villa", "Villa"],
                          ["cabin", "Kabin"],
                          ["cottage", "Bağ evi"],
                          ["tiny", "Kiçik ev"],
                        ].map(([id, name]) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Gecəlik qiymət
                      <input
                        type="number"
                        min={1}
                        max={100000}
                        step="0.01"
                        value={draft.price}
                        onChange={(e) => field("price", Number(e.target.value))}
                        required
                      />
                    </label>
                    <label>
                      Valyuta
                      <select
                        value={draft.currency}
                        onChange={(e) =>
                          field("currency", e.target.value as "AZN" | "USD")
                        }
                      >
                        <option>AZN</option>
                        <option>USD</option>
                      </select>
                    </label>
                    {(
                      [
                        ["guests", "Qonaq sayı", 1, 50],
                        ["bedrooms", "Yataq otaqları", 0, 30],
                        ["beds", "Çarpayılar", 1, 50],
                      ] as const
                    ).map(([key, label, min, max]) => (
                      <label key={key}>
                        {label}
                        <input
                          type="number"
                          min={min}
                          max={max}
                          value={draft[key]}
                          required
                          onChange={(e) => field(key, Number(e.target.value))}
                        />
                      </label>
                    ))}
                    <label>
                      Status
                      <select
                        value={draft.status}
                        onChange={(e) =>
                          field(
                            "status",
                            e.target.value as "draft" | "published",
                          )
                        }
                      >
                        <option value="draft">Qaralama</option>
                        <option value="published">Yayımlanmış</option>
                      </select>
                    </label>
                    <label>
                      3D model
                      <select
                        value={draft.modelId || ""}
                        onChange={(e) =>
                          field("modelId", e.target.value || undefined)
                        }
                      >
                        <option value="">3D model yoxdur</option>
                        {[
                          "baku",
                          "gabala",
                          "sheki",
                          "ganja",
                          "istanbul",
                          "antalya",
                          "izmir",
                          "bursa",
                          "austin",
                          "san-diego",
                          "chicago",
                          "orlando",
                        ].map((id) => (
                          <option key={id} value={id}>
                            {id} · demo
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    Şəkillər · hər sətirdə bir HTTPS URL və ya /images/fayl.jpg
                    <textarea
                      rows={3}
                      value={draft.images.join("\n")}
                      onChange={(e) =>
                        field("images", e.target.value.split("\n"))
                      }
                      required
                    />
                  </label>
                  <p className="admin-muted">
                    Seçilən 3D model elanın real planına uyğun olmalıdır. Hazır
                    modellər demodur.
                  </p>
                  <fieldset>
                    <legend>İmkanlar</legend>
                    <div className="admin-amenities">
                      {[
                        ["wifi", "Wi-Fi"],
                        ["parking", "Parkinq"],
                        ["pool", "Hovuz"],
                        ["kitchen", "Mətbəx"],
                        ["ac", "Kondisioner"],
                        ["fireplace", "Kamin"],
                        ["bbq", "Mangal"],
                        ["desk", "İş masası"],
                      ].map(([id, name]) => (
                        <label key={id}>
                          <input
                            type="checkbox"
                            checked={draft.amenities.includes(id)}
                            onChange={(e) =>
                              field(
                                "amenities",
                                e.target.checked
                                  ? [...draft.amenities, id]
                                  : draft.amenities.filter((x) => x !== id),
                              )
                            }
                          />
                          {name}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div className="admin-actions">
                    <button className="btn btn-primary" disabled={busy}>
                      {busy ? "Saxlanılır…" : "Elanı saxla"}
                    </button>
                    <button
                      className="btn btn-outline"
                      type="button"
                      disabled={busy}
                      onClick={() => setDraft(null)}
                    >
                      Ləğv et
                    </button>
                  </div>
                </form>
              )}
              {!items.length && !draft && (
                <div className="admin-panel">
                  <h3>İlk elanınızı yaradın</h3>
                  <p>
                    Yeni elan yaradın, qaralama saxlayın və hazır olanda
                    yayımlayın.
                  </p>
                </div>
              )}
              <div className="admin-list">
                {items.map((item) => (
                  <article className="admin-panel admin-row" key={item.id}>
                    <div>
                      <h3>{item.title.az}</h3>
                      <p>
                        {item.city} · {item.price} {item.currency || "AZN"} ·{" "}
                        {item.status === "published"
                          ? "Yayımlanmış"
                          : "Qaralama"}
                      </p>
                    </div>
                    <div className="admin-actions">
                      {item.status === "published" && (
                        <a
                          className="btn btn-outline"
                          href={`#/listing/${item.id}`}
                        >
                          <ExternalLink size={16} /> Bax
                        </a>
                      )}
                      <button
                        className="btn btn-outline"
                        disabled={busy}
                        onClick={() => {
                          setEditing(item.id);
                          setDraft({
                            ...item,
                            currency: item.currency || "AZN",
                          });
                        }}
                      >
                        <Pencil size={16} /> Redaktə
                      </button>
                      <button
                        className="btn btn-outline"
                        disabled={busy}
                        onClick={() => setPendingDelete(item.id)}
                      >
                        <Trash2 size={16} /> Sil
                      </button>
                    </div>
                    {pendingDelete === item.id && (
                      <div
                        className="admin-delete"
                        role="group"
                        aria-label="Elanı silmə təsdiqi"
                      >
                        <p>
                          “{item.title.az}” silinsin? Bu əməliyyat geri
                          qaytarılmır.
                        </p>
                        <button
                          className="btn btn-outline"
                          disabled={busy}
                          onClick={() => setPendingDelete(null)}
                        >
                          Ləğv et
                        </button>
                        <button
                          className="btn btn-primary"
                          disabled={busy}
                          onClick={() =>
                            void run(async () => {
                              await api(`/admin/listings/${item.id}`, {
                                method: "DELETE",
                              });
                              setPendingDelete(null);
                              if (editing === item.id) setDraft(null);
                              await refresh();
                              onCatalogChange();
                              setNotice("Elan silindi.");
                            })
                          }
                        >
                          Bəli, sil
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
