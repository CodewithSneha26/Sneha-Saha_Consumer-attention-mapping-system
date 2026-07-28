--
-- PostgreSQL database dump
--

\restrict IuGUri9Q4o4vdGa4QMR3fnQdjG4rKAhAddAPHYpgbqejdjEMhQdft5jQcJhu353

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

-- Started on 2026-07-28 17:01:06

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 236 (class 1259 OID 16490)
-- Name: alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerts (
    id integer NOT NULL,
    alert_type character varying NOT NULL,
    severity character varying NOT NULL,
    message character varying NOT NULL,
    related_shelf character varying,
    created_at character varying,
    resolved character varying
);


ALTER TABLE public.alerts OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16489)
-- Name: alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerts_id_seq OWNER TO postgres;

--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 235
-- Name: alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alerts_id_seq OWNED BY public.alerts.id;


--
-- TOC entry 228 (class 1259 OID 16450)
-- Name: attention_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attention_records (
    id integer NOT NULL,
    person_track_id integer NOT NULL,
    zone character varying,
    attention_status character varying NOT NULL,
    duration_seconds integer NOT NULL,
    created_at character varying
);


ALTER TABLE public.attention_records OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16449)
-- Name: attention_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attention_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attention_records_id_seq OWNER TO postgres;

--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 227
-- Name: attention_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attention_records_id_seq OWNED BY public.attention_records.id;


--
-- TOC entry 224 (class 1259 OID 16425)
-- Name: cameras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cameras (
    id integer NOT NULL,
    store_id integer NOT NULL,
    camera_name character varying NOT NULL,
    location_description character varying
);


ALTER TABLE public.cameras OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16424)
-- Name: cameras_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cameras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cameras_id_seq OWNER TO postgres;

--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 223
-- Name: cameras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cameras_id_seq OWNED BY public.cameras.id;


--
-- TOC entry 226 (class 1259 OID 16440)
-- Name: detection_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detection_sessions (
    id integer NOT NULL,
    person_track_id integer NOT NULL,
    dwell_time_seconds integer NOT NULL,
    positions_recorded integer NOT NULL,
    created_at character varying
);


ALTER TABLE public.detection_sessions OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16439)
-- Name: detection_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detection_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detection_sessions_id_seq OWNER TO postgres;

--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 225
-- Name: detection_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detection_sessions_id_seq OWNED BY public.detection_sessions.id;


--
-- TOC entry 232 (class 1259 OID 16470)
-- Name: journey_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journey_logs (
    id integer NOT NULL,
    person_track_id integer NOT NULL,
    zone character varying NOT NULL,
    sequence_number integer NOT NULL,
    entered_at character varying
);


ALTER TABLE public.journey_logs OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16469)
-- Name: journey_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.journey_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.journey_logs_id_seq OWNER TO postgres;

--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 231
-- Name: journey_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.journey_logs_id_seq OWNED BY public.journey_logs.id;


--
-- TOC entry 234 (class 1259 OID 16480)
-- Name: position_points; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.position_points (
    id integer NOT NULL,
    person_track_id integer NOT NULL,
    x integer NOT NULL,
    y integer NOT NULL,
    recorded_at character varying
);


ALTER TABLE public.position_points OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16479)
-- Name: position_points_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.position_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.position_points_id_seq OWNER TO postgres;

--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 233
-- Name: position_points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.position_points_id_seq OWNED BY public.position_points.id;


--
-- TOC entry 230 (class 1259 OID 16460)
-- Name: product_interactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_interactions (
    id integer NOT NULL,
    person_track_id integer NOT NULL,
    shelf_zone character varying NOT NULL,
    interaction_type character varying NOT NULL,
    duration_seconds integer NOT NULL,
    created_at character varying
);


ALTER TABLE public.product_interactions OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16459)
-- Name: product_interactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_interactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_interactions_id_seq OWNER TO postgres;

--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 229
-- Name: product_interactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_interactions_id_seq OWNED BY public.product_interactions.id;


--
-- TOC entry 222 (class 1259 OID 16410)
-- Name: shelves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shelves (
    id integer NOT NULL,
    store_id integer NOT NULL,
    shelf_name character varying NOT NULL,
    zone character varying
);


ALTER TABLE public.shelves OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16409)
-- Name: shelves_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shelves_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shelves_id_seq OWNER TO postgres;

--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 221
-- Name: shelves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shelves_id_seq OWNED BY public.shelves.id;


--
-- TOC entry 220 (class 1259 OID 16400)
-- Name: stores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stores (
    id integer NOT NULL,
    name character varying NOT NULL,
    location character varying NOT NULL
);


ALTER TABLE public.stores OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16399)
-- Name: stores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stores_id_seq OWNER TO postgres;

--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 219
-- Name: stores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stores_id_seq OWNED BY public.stores.id;


--
-- TOC entry 218 (class 1259 OID 16389)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16388)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4796 (class 2604 OID 16493)
-- Name: alerts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);


--
-- TOC entry 4792 (class 2604 OID 16453)
-- Name: attention_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attention_records ALTER COLUMN id SET DEFAULT nextval('public.attention_records_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 16428)
-- Name: cameras id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cameras ALTER COLUMN id SET DEFAULT nextval('public.cameras_id_seq'::regclass);


--
-- TOC entry 4791 (class 2604 OID 16443)
-- Name: detection_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detection_sessions ALTER COLUMN id SET DEFAULT nextval('public.detection_sessions_id_seq'::regclass);


--
-- TOC entry 4794 (class 2604 OID 16473)
-- Name: journey_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journey_logs ALTER COLUMN id SET DEFAULT nextval('public.journey_logs_id_seq'::regclass);


--
-- TOC entry 4795 (class 2604 OID 16483)
-- Name: position_points id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.position_points ALTER COLUMN id SET DEFAULT nextval('public.position_points_id_seq'::regclass);


--
-- TOC entry 4793 (class 2604 OID 16463)
-- Name: product_interactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_interactions ALTER COLUMN id SET DEFAULT nextval('public.product_interactions_id_seq'::regclass);


--
-- TOC entry 4789 (class 2604 OID 16413)
-- Name: shelves id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves ALTER COLUMN id SET DEFAULT nextval('public.shelves_id_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 16403)
-- Name: stores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores ALTER COLUMN id SET DEFAULT nextval('public.stores_id_seq'::regclass);


--
-- TOC entry 4787 (class 2604 OID 16392)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4826 (class 2606 OID 16497)
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 16457)
-- Name: attention_records attention_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attention_records
    ADD CONSTRAINT attention_records_pkey PRIMARY KEY (id);


--
-- TOC entry 4808 (class 2606 OID 16432)
-- Name: cameras cameras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cameras
    ADD CONSTRAINT cameras_pkey PRIMARY KEY (id);


--
-- TOC entry 4811 (class 2606 OID 16447)
-- Name: detection_sessions detection_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detection_sessions
    ADD CONSTRAINT detection_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4821 (class 2606 OID 16477)
-- Name: journey_logs journey_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journey_logs
    ADD CONSTRAINT journey_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4824 (class 2606 OID 16487)
-- Name: position_points position_points_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.position_points
    ADD CONSTRAINT position_points_pkey PRIMARY KEY (id);


--
-- TOC entry 4818 (class 2606 OID 16467)
-- Name: product_interactions product_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_interactions
    ADD CONSTRAINT product_interactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 16417)
-- Name: shelves shelves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT shelves_pkey PRIMARY KEY (id);


--
-- TOC entry 4803 (class 2606 OID 16407)
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- TOC entry 4800 (class 2606 OID 16396)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4827 (class 1259 OID 16498)
-- Name: ix_alerts_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_alerts_id ON public.alerts USING btree (id);


--
-- TOC entry 4815 (class 1259 OID 16458)
-- Name: ix_attention_records_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_attention_records_id ON public.attention_records USING btree (id);


--
-- TOC entry 4809 (class 1259 OID 16438)
-- Name: ix_cameras_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_cameras_id ON public.cameras USING btree (id);


--
-- TOC entry 4812 (class 1259 OID 16448)
-- Name: ix_detection_sessions_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_detection_sessions_id ON public.detection_sessions USING btree (id);


--
-- TOC entry 4819 (class 1259 OID 16478)
-- Name: ix_journey_logs_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_journey_logs_id ON public.journey_logs USING btree (id);


--
-- TOC entry 4822 (class 1259 OID 16488)
-- Name: ix_position_points_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_position_points_id ON public.position_points USING btree (id);


--
-- TOC entry 4816 (class 1259 OID 16468)
-- Name: ix_product_interactions_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_product_interactions_id ON public.product_interactions USING btree (id);


--
-- TOC entry 4804 (class 1259 OID 16423)
-- Name: ix_shelves_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_shelves_id ON public.shelves USING btree (id);


--
-- TOC entry 4801 (class 1259 OID 16408)
-- Name: ix_stores_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_stores_id ON public.stores USING btree (id);


--
-- TOC entry 4797 (class 1259 OID 16397)
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- TOC entry 4798 (class 1259 OID 16398)
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- TOC entry 4829 (class 2606 OID 16433)
-- Name: cameras cameras_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cameras
    ADD CONSTRAINT cameras_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id);


--
-- TOC entry 4828 (class 2606 OID 16418)
-- Name: shelves shelves_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT shelves_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id);


-- Completed on 2026-07-28 17:01:07

--
-- PostgreSQL database dump complete
--

\unrestrict IuGUri9Q4o4vdGa4QMR3fnQdjG4rKAhAddAPHYpgbqejdjEMhQdft5jQcJhu353

