/**
 * Shelzys Designs - Automated Product Image Generator
 *
 * This script generates 50 product images using OpenAI's DALL-E 3 API.
 * Each image is generated based on pre-written prompts optimized for
 * different platforms (Amazon, Pinterest, TikTok, Instagram, etc.).
 *
 * Usage:
 *   1. Set OPENAI_API_KEY environment variable
 *   2. Run: npm run generate
 *
 * Options:
 *   - DRY_RUN=true: List images without generating
 *   - START_ID=N: Start from prompt ID N (for resuming)
 *   - END_ID=N: End at prompt ID N (for partial runs)
 */

import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";

// Types
type PromptItem = {
  id: number;
  category: string;
  aspect_ratio: string;
  tags: string[];
  lighting: string;
  name_color: string;
  prompt: string;
};

type ImageSize = "1024x1024" | "1792x1024" | "1024x1792";

// All 50 prompts
const prompts: PromptItem[] = [
  {
    "id": 1,
    "category": "amazon_main",
    "aspect_ratio": "1:1",
    "tags": ["amazon_main", "studio", "single_bottle", "front_facing"],
    "lighting": "even, soft studio lighting, minimal shadows",
    "name_color": "deep navy blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always render the Shelzys Designs white aluminum matte flip-straw bottle with the exact same shape, silhouette, height, curvature, handle, lid seam, and flip-straw mechanism as my real product photos. Smooth vertical wall, no distortion. Never change the bottle or lid structure. Use clean premium fonts for personalization, perfectly straight, crisp, and centered, in bold high-contrast colors with no warping. Create a hyper realistic Amazon main image: single bottle, centered on a pure white background, even studio lighting, ultra sharp detail, no props, composition optimized for product detail and conversion."
  },
  {
    "id": 2,
    "category": "amazon_main",
    "aspect_ratio": "1:1",
    "tags": ["amazon_main", "studio", "single_bottle", "angled_view"],
    "lighting": "softbox studio lighting, subtle shadow behind bottle",
    "name_color": "black",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always render the Shelzys Designs white aluminum matte flip-straw bottle with the exact same silhouette, proportions, curvature, handle, lid seam, and flip-straw design as my reference photos. The bottle wall must be perfectly smooth and vertical with no distortion. Never modify the bottle or lid geometry. Use a clean premium sans serif font for the name, horizontal across the front, perfectly centered and sharp in solid black. Create a hyper realistic Amazon main image on a pure white background, showing the bottle at a slight three quarter angle to reveal the flip straw and handle, with minimal soft shadow and extremely crisp detail."
  },
  {
    "id": 3,
    "category": "amazon_main",
    "aspect_ratio": "1:1",
    "tags": ["amazon_main", "studio", "single_bottle", "close_up"],
    "lighting": "bright studio lighting with subtle reflections",
    "name_color": "sage green",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render the Shelzys Designs white aluminum matte flip-straw bottle with the exact same height, diameter, curvature, handle shape, lid seam, and flip-straw mechanism as the real product. The body must be smooth and straight, with no warping. Never alter the bottle or lid structure. Use a refined serif font for the name in sage green, horizontally centered, very crisp. Create a hyper realistic Amazon ready close up main image on a pure white background, framed tightly to highlight the texture of the matte metal, the precise printing, and the lid details, optimized for zoom on desktop and mobile."
  },
  {
    "id": 4,
    "category": "amazon_main",
    "aspect_ratio": "1:1",
    "tags": ["amazon_main", "studio", "single_bottle", "back_view"],
    "lighting": "neutral white studio light, very soft shadow",
    "name_color": "pool blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always render the white aluminum matte Shelzys Designs bottle using the exact same shape, silhouette, and lid structure as my source photos, including the flip-straw hinge, handle, height, and straight vertical wall. Do not change any physical proportions. Use a clean modern font in pool blue for the name, vertically printed from bottom to top along one side of the bottle, perfectly straight and crisp. Create a hyper realistic Amazon main style studio image on a pure white background, showing the bottle from a slight rear angle so both the handle and the vertical name are clearly visible, with minimal shadow and very sharp edges."
  },
  {
    "id": 5,
    "category": "amazon_infographic",
    "aspect_ratio": "4:5",
    "tags": ["amazon_secondary", "infographic", "feature_callouts"],
    "lighting": "bright, neutral studio lighting",
    "name_color": "navy blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always render the Shelzys Designs white aluminum matte flip-straw bottle with the exact same silhouette, curvature, height, lid structure, handle shape, and flip-straw proportions as the real product, with a smooth vertical wall and zero distortion. Never modify the bottle or lid geometry. Personalization uses a premium clean font in deep navy, perfectly straight and crisp. Create a hyper realistic Amazon infographic image on a light neutral background with the bottle large in the center and minimal modern text callouts around it highlighting features like flip-straw lid, spill resistant design, durable matte aluminum, and custom name printing. Keep the layout clean and conversion focused."
  },
  {
    "id": 6,
    "category": "amazon_infographic",
    "aspect_ratio": "4:5",
    "tags": ["amazon_secondary", "infographic", "size_chart"],
    "lighting": "even studio light with soft shadows",
    "name_color": "charcoal gray",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render the Shelzys Designs white aluminum matte bottle with perfectly accurate silhouette, height, diameter, curvature, handle, lid seam, and flip-straw design matching my real product photos. The body must be perfectly straight, no bulging or bending. Never alter the bottle or lid structure. Print the name in a clean sans serif font in charcoal gray, centered and sharp. Create a hyper realistic Amazon infographic image that includes the bottle on a clean background along with measurements for height and width, simple icons for care instructions, and a compact size comparison graphic, all in a modern minimal style that reinforces premium quality."
  },
  {
    "id": 7,
    "category": "amazon_infographic",
    "aspect_ratio": "4:5",
    "tags": ["amazon_secondary", "infographic", "benefits"],
    "lighting": "soft, bright studio lighting",
    "name_color": "dark forest green",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always depict the Shelzys Designs white aluminum matte flip-straw bottle with the correct and consistent shape, including the exact curvature, height, diameter, handle, lid seam, and flip-straw hinge from my actual product. The side walls must be smooth and vertical. Never change the bottle or lid geometry. Use a refined premium font in dark forest green for the personalized name, perfectly aligned and crisp. Create a hyper realistic Amazon infographic image on a soft light background that presents the bottle with three or four clean benefit blocks such as stay hydrated, personalized for you, durable and reusable, and great for travel, using very minimal icons and typography."
  },
  {
    "id": 8,
    "category": "amazon_group",
    "aspect_ratio": "4:5",
    "tags": ["amazon_secondary", "group_shot", "multiple_bottles"],
    "lighting": "studio lighting with gentle gradient background",
    "name_color": "mixed navy, coral, sage",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render multiple Shelzys Designs white aluminum matte flip-straw bottles, each with the exact same silhouette, height, curvature, diameter, handle shape, and lid seam as my physical product photos. The walls must be perfectly smooth and straight with no distortion. Never alter the bottle or lid structure on any bottle. Use premium fonts with names in a mix of navy, soft coral, and sage green, all perfectly straight and crisp. Create a hyper realistic Amazon group studio image on a light gradient background, showing four to six bottles arranged in a gentle arc to demonstrate color options and personalization, with subtle reflections and a premium catalog feel."
  },
  {
    "id": 9,
    "category": "amazon_group",
    "aspect_ratio": "3:2",
    "tags": ["amazon_secondary", "family_set", "multiple_bottles"],
    "lighting": "softbox studio lighting with mild front shadow",
    "name_color": "mixed black and navy",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Depict several Shelzys Designs white aluminum matte flip-straw bottles, all sharing the exact same shape, proportions, curvature, handle, lid seam, and flip-straw mechanism as the real product. The vertical walls must be smooth and perfectly straight, with no warping or bending. Never change the bottle or lid geometry. Use clean modern fonts with names in black and navy, centered and crisp. Create a hyper realistic Amazon group image on a pure white or extremely light background, showing a family set of bottles of the same size side by side, labeled with different names, conveying matching family or team personalization in a premium way."
  },
  {
    "id": 10,
    "category": "amazon_group",
    "aspect_ratio": "16:9",
    "tags": ["amazon_secondary", "panoramic_group", "multiple_bottles"],
    "lighting": "even studio light with subtle floor reflection",
    "name_color": "sunset coral",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Show a wide row of Shelzys Designs white aluminum matte flip-straw bottles, each rendered with the exact same silhouette, curvature, height, handle, lid seam, and flip-straw mechanism as my actual product photos, with perfectly straight vertical walls. Do not modify the bottle or lid structure on any unit. Use a premium bold font in sunset coral for each name, vertical along the bottle body, sharp and aligned. Create a hyper realistic panoramic studio image suitable as an Amazon secondary image, with bottles evenly spaced in a row on a clean light background and a subtle floor reflection for a high end catalog feel."
  },
  {
    "id": 11,
    "category": "pinterest",
    "aspect_ratio": "2:3",
    "tags": ["pinterest", "flat_lay", "aesthetic", "desktop"],
    "lighting": "soft natural window light with gentle shadows",
    "name_color": "soft sage green",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always render the Shelzys Designs white aluminum matte flip-straw bottle with perfectly accurate silhouette, height, curvature, handle, lid seam, and flip-straw geometry matching my product photos, with a smooth straight wall and no distortion. Never alter the bottle or lid structure. Use an elegant serif font in soft sage green for the name, horizontal and centered. Create a hyper realistic Pinterest friendly flat lay: the bottle placed on a white desk with a laptop, notebook, pen, a sprig of greenery, and delicate gold accessories, shot from above with soft natural light and plenty of negative space for overlays, giving an aspirational work from anywhere mood."
  },
  {
    "id": 12,
    "category": "pinterest",
    "aspect_ratio": "2:3",
    "tags": ["pinterest", "wellness", "morning_routine"],
    "lighting": "golden morning window light",
    "name_color": "warm sand",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render the Shelzys Designs white aluminum matte flip-straw bottle with the exact same height, diameter, curvature, handle, lid seam, and flip-straw details as the real product, keeping the vertical wall perfectly smooth and straight. Never change the bottle or lid geometry. Use a clean modern font in a warm sand tone for the name, crisp and centered. Create a hyper realistic Pinterest style morning routine scene on a bedside table with a book, a small vase with flowers, linen bedding in the background, and soft golden morning light, designed to feel calming, wellness focused, and highly shareable."
  },
  {
    "id": 13,
    "category": "pinterest",
    "aspect_ratio": "2:3",
    "tags": ["pinterest", "gym_bag", "active_lifestyle"],
    "lighting": "bright natural light with light vignette",
    "name_color": "electric blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Show the Shelzys Designs white aluminum matte flip-straw bottle with its exact correct silhouette, handle, lid seam, and flip-straw mechanism as seen in my reference photos, with a perfectly straight smooth body and no warping. Never alter the bottle or lid structure. Use a bold sans serif font in electric blue for the personalized name, vertical along the bottle, sharp and clean. Create a hyper realistic Pinterest ready lifestyle image with the bottle partially tucked into a stylish gym bag alongside a towel, sneakers, and headphones, shot in bright natural light on a concrete or wood floor for an active, motivating vibe."
  },
  {
    "id": 14,
    "category": "pinterest",
    "aspect_ratio": "2:3",
    "tags": ["pinterest", "poolside", "summer"],
    "lighting": "strong sun with soft fill, slight sparkle on water",
    "name_color": "hot pink",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Depict the white aluminum matte Shelzys Designs flip-straw bottle with the exact same dimensions, curvature, handle, lid seam, and flip-straw structure as the real product, with straight smooth walls and no distortion. Never change the bottle or lid geometry. Use a playful but premium font in hot pink for the name, vertical on the bottle and very crisp. Create a hyper realistic Pinterest style poolside scene with the bottle on a towel near a swimming pool, sunglasses and a paperback nearby, water sparkling in the background, and bright summer sun for a fun weekend vibe."
  },
  {
    "id": 15,
    "category": "pinterest",
    "aspect_ratio": "2:3",
    "tags": ["pinterest", "meal_prep", "kitchen_counter"],
    "lighting": "soft kitchen daylight with slight backlight",
    "name_color": "forest green",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Show the Shelzys Designs white aluminum matte flip-straw bottle with precise and consistent silhouette, height, handle, lid seam, and flip-straw hinge, matching my real product images, with a straight smooth wall and absolutely no warping. Never alter the bottle or lid structure. Use a premium serif font in forest green for the name, horizontal and centered. Create a hyper realistic Pinterest ready kitchen scene on a clean counter with meal prep containers, fresh produce, and a cutting board, with soft daylight and a slightly blurred background, evoking healthy, organized meal prep."
  },
  {
    "id": 16,
    "category": "pinterest",
    "aspect_ratio": "2:3",
    "tags": ["pinterest", "desk_setup", "aesthetic_productivity"],
    "lighting": "soft daylight with gentle shadow to the side",
    "name_color": "charcoal gray",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always render the white aluminum matte Shelzys Designs flip-straw bottle with the exact same shape, height, curvature, handle, lid seam, and flip-straw mechanism as my product photos, with perfectly straight smooth walls and no distortion. Never change the bottle or lid structure. Use a clean minimalist font in charcoal gray for the name, horizontal and centered. Create a hyper realistic Pinterest style desk setup with the bottle next to a laptop, a planner, a pen, and a small plant, shot from a slight overhead angle with lots of negative space and a calming, productive vibe."
  },
  {
    "id": 17,
    "category": "pinterest",
    "aspect_ratio": "2:3",
    "tags": ["pinterest", "bridesmaid_gift", "wedding"],
    "lighting": "soft diffused window light, romantic feel",
    "name_color": "dusty rose",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render the Shelzys Designs white aluminum matte flip-straw bottle with a completely accurate silhouette, handle, lid seam, and flip-straw design matching my real product, and a smooth straight body without any warping. Never modify the bottle or lid geometry. Use an elegant script or serif font in dusty rose for the name, horizontal and crisp. Create a hyper realistic Pinterest worthy bridesmaid gift scene with the bottle in a gift box with tissue paper, ribbon, and small bridal accessories like earrings or a silk ribbon, styled on a linen surface with soft romantic lighting."
  },
  {
    "id": 18,
    "category": "pinterest",
    "aspect_ratio": "2:3",
    "tags": ["pinterest", "travel_flat_lay", "airport"],
    "lighting": "bright diffused light, slight top-down angle",
    "name_color": "navy blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Depict the Shelzys Designs white aluminum matte flip-straw bottle with the exact same dimensions, curvature, handle shape, lid seam, and flip-straw hinge as my reference product, with a perfectly straight smooth wall and no distortion. Never alter the bottle or lid structure. Use a premium font in navy blue for the vertical name, clean and sharp. Create a hyper realistic Pinterest style travel flat lay showing the bottle, a passport, boarding pass, sunglasses, and a carry on bag on a neutral surface, evoking stylish airport and travel prep."
  },
  {
    "id": 19,
    "category": "tiktok_ad",
    "aspect_ratio": "9:16",
    "tags": ["tiktok", "ugc_style", "gym_scene"],
    "lighting": "bright gym lighting with slight motion blur feel",
    "name_color": "electric blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always render the Shelzys Designs white aluminum matte flip-straw bottle with an exactly accurate silhouette, height, curvature, handle, lid seam, and flip-straw mechanism matching my product photos, with a straight smooth wall and no distortion. Never modify the bottle or lid structure. Use a bold sans serif font in electric blue for the vertical name, extremely crisp. Create a hyper realistic TikTok style frame: a person's hand grabbing the bottle from a gym bench, visible workout equipment in the blurred background, energetic composition and lighting that feels like a paused moment from a viral short form video."
  },
  {
    "id": 20,
    "category": "tiktok_ad",
    "aspect_ratio": "9:16",
    "tags": ["tiktok", "morning_walk", "coffee_shop"],
    "lighting": "soft outdoor morning light with urban background",
    "name_color": "black",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Depict the white aluminum matte Shelzys Designs flip-straw bottle with the exact same silhouette, proportions, curvature, handle, lid seam, and flip-straw hinge as my real product photos, with a smooth vertical wall. Never alter the bottle or lid geometry. Use a clean bold font in black for the horizontal name, centered and sharp. Create a hyper realistic TikTok style vertical frame of someone walking down a city sidewalk holding the bottle, with a coffee shop or storefront in the background, slightly blurred for depth, with a candid energetic feel as if from a lifestyle vlog."
  },
  {
    "id": 21,
    "category": "tiktok_ad",
    "aspect_ratio": "9:16",
    "tags": ["tiktok", "desk_to_gym_transition"],
    "lighting": "mixed indoor office and hallway light",
    "name_color": "navy blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Show the Shelzys Designs white aluminum matte flip-straw bottle with perfectly accurate and consistent silhouette, handle, lid seam, and flip-straw details, and a straight smooth vertical wall. Never change the bottle or lid structure. Use a premium sans serif font in navy blue for the personalized name, horizontal and clean. Create a hyper realistic TikTok vertical frame that looks like a transition from work to workout: the bottle on a desk next to a laptop and then being picked up off the desk with a blurred hallway or elevator in the background, capturing movement and a day in the life energy."
  },
  {
    "id": 22,
    "category": "tiktok_ad",
    "aspect_ratio": "9:16",
    "tags": ["tiktok", "car_cupholder", "on_the_go"],
    "lighting": "natural daylight through car windows",
    "name_color": "coral",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render the white aluminum matte Shelzys Designs flip-straw bottle with the precise shape, height, curvature, handle, lid seam, and flip-straw geometry seen in my reference photos, with a smooth undistorted vertical wall. Never alter the bottle or lid structure. Use a bold modern font in coral for the vertical name, crisp and aligned. Create a hyper realistic TikTok style vertical frame of the bottle in a car cupholder, with a hand reaching toward it, dashboard and road slightly blurred, conveying on the go hydration and real world utility in a social first style."
  },
  {
    "id": 23,
    "category": "tiktok_ad",
    "aspect_ratio": "9:16",
    "tags": ["tiktok", "kitchen_counter_talking_head_feel"],
    "lighting": "soft kitchen light with subject facing a window",
    "name_color": "sage green",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always depict the Shelzys Designs white aluminum matte flip-straw bottle with an exactly accurate silhouette, curvature, handle, lid seam, and flip-straw hinge matching my product photos, with smooth straight walls. Never change the bottle or lid geometry. Use a premium serif font in sage green for the horizontal name, centered and crisp. Create a hyper realistic TikTok vertical frame styled like a talking head video, with the bottle prominently placed on a kitchen counter in the foreground and a blurred hint of a person in the background, framed to look like a product callout within a creator video."
  },
  {
    "id": 24,
    "category": "tiktok_ad",
    "aspect_ratio": "9:16",
    "tags": ["tiktok", "locker_room", "sports"],
    "lighting": "indoor locker room lighting with slight vignette",
    "name_color": "white on dark label band",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render the Shelzys Designs white aluminum matte flip-straw bottle with perfect fidelity to my product silhouette, including height, curvature, handle, lid seam, and flip-straw mechanism, with smooth straight walls. Never alter the bottle or lid structure. Use a bold sans serif font in white on a subtle dark name band printed on the bottle, perfectly straight and sharp. Create a hyper realistic TikTok style vertical frame inside a locker room with the bottle on a bench or shelf, sports gear and a jersey in the slightly blurred background, evoking team sports and game day energy."
  },
  {
    "id": 25,
    "category": "tiktok_ad",
    "aspect_ratio": "9:16",
    "tags": ["tiktok", "unboxing", "gift"],
    "lighting": "soft diffused overhead and side light",
    "name_color": "dusty rose",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Depict the Shelzys Designs white aluminum matte flip-straw bottle with exact silhouette, curvature, height, handle shape, lid seam, and flip-straw hinge as the real product, with a smooth straight wall and no distortion. Never modify the bottle or lid geometry. Use an elegant modern script or serif font in dusty rose for the name, horizontal and crisp. Create a hyper realistic TikTok vertical frame that feels like a gift unboxing moment, with the bottle being lifted from a box filled with tissue paper on a table, hands visible, and the background softly blurred to keep focus on the product."
  },
  {
    "id": 26,
    "category": "tiktok_ad",
    "aspect_ratio": "9:16",
    "tags": ["tiktok", "beach_walk", "lifestyle"],
    "lighting": "golden hour beach light, warm and cinematic",
    "name_color": "navy blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always show the Shelzys Designs white aluminum matte flip-straw bottle with perfectly accurate shape, height, curvature, handle, lid seam, and flip-straw mechanism, with a smooth straight wall and no distortion. Never alter the bottle or lid structure. Use a premium serif or sans serif font in navy blue for the vertical name, sharp and clean. Create a hyper realistic TikTok vertical frame of a person walking along the beach holding the bottle at their side, with waves and sand in the background, warm golden hour light, and a cinematic lifestyle feel as if from a travel vlog."
  },
  {
    "id": 27,
    "category": "kids_sports",
    "aspect_ratio": "16:9",
    "tags": ["kids_sports", "soccer_field", "team_lineup"],
    "lighting": "bright midday outdoor light with clear sky",
    "name_color": "mixed bright blue, orange, lime green, hot pink",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render multiple Shelzys Designs white aluminum matte flip-straw bottles, all with the exact same silhouette, height, curvature, handle, lid seam, and flip-straw structure as my real product photos, with straight smooth walls and no distortion. Never change the bottle or lid geometry. Use bold block fonts with kids names printed vertically from bottom to top in bright blue, orange, lime green, and hot pink, all crisp and straight. Create a hyper realistic kids and sports scene on a soccer field sideline, with the bottles lined up on the grass in front of a goal, a ball nearby, and slightly blurred kids in uniforms in the background."
  },
  {
    "id": 28,
    "category": "kids_sports",
    "aspect_ratio": "16:9",
    "tags": ["kids_sports", "basketball_court", "bench"],
    "lighting": "indoor gym lighting, slightly warm",
    "name_color": "bright orange",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Depict several Shelzys Designs white aluminum matte flip-straw bottles, each with identical silhouette, curvature, height, handle, lid seam, and flip-straw mechanism as the reference product, with smooth straight walls. Never alter the bottle or lid structure. Use bold athletic block fonts with kids names vertically in bright orange, crisp and straight. Create a hyper realistic kids sports scene on a basketball bench, with the bottles lined up next to basketballs and jerseys, court and hoop slightly blurred in the background, evoking game time energy."
  },
  {
    "id": 29,
    "category": "kids_sports",
    "aspect_ratio": "16:9",
    "tags": ["kids_sports", "baseball_dugout", "team"],
    "lighting": "late afternoon outdoor light with soft shadows",
    "name_color": "royal blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Show a row of Shelzys Designs white aluminum matte flip-straw bottles, all with perfectly matching silhouette, height, curvature, handle shape, lid seam, and flip-straw hinge as my real product images, with straight smooth walls. Never change the bottle or lid structure. Use strong block type in royal blue for vertical names, sharp and aligned. Create a hyper realistic kids sports scene in a baseball dugout, bottles arranged along the bench with helmets and gloves, chain link fence and field visible in the background."
  },
  {
    "id": 30,
    "category": "kids_sports",
    "aspect_ratio": "16:9",
    "tags": ["kids_sports", "track_meet", "starting_line"],
    "lighting": "bright daylight with dynamic shadows",
    "name_color": "teal",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render multiple Shelzys Designs white aluminum matte flip-straw bottles with identical silhouette, height, curvature, handle, lid seam, and flip-straw design as my product, with straight smooth walls. Never alter the bottle or lid structure. Use bold sans serif fonts with vertical names in teal, crisp and straight. Create a hyper realistic kids sports scene at a track meet, with the bottles clustered near a starting line or lane markers, running spikes and a stopwatch nearby, and some blurred runners in the distance."
  },
  {
    "id": 31,
    "category": "kids_sports",
    "aspect_ratio": "16:9",
    "tags": ["kids_sports", "lacrosse_field", "sideline"],
    "lighting": "slightly overcast daylight, soft and even",
    "name_color": "bright purple",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Depict several Shelzys Designs white aluminum matte flip-straw bottles with the exact same shape, curvature, height, handle, lid seam, and flip-straw hinge as in my reference photos, with a straight smooth wall and no distortion. Never change the bottle or lid structure. Use bold athletic lettering for vertical names in bright purple, crisp and aligned. Create a hyper realistic kids sports scene on a lacrosse sideline with sticks, nets, and cones visible, bottles standing together in the grass ready for the team."
  },
  {
    "id": 32,
    "category": "kids_sports",
    "aspect_ratio": "16:9",
    "tags": ["kids_sports", "football_practice", "cooler"],
    "lighting": "late afternoon golden practice light",
    "name_color": "bright red",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always show the Shelzys Designs white aluminum matte flip-straw bottles with perfectly accurate silhouette, height, curvature, handle, lid seam, and flip-straw geometry, with smooth straight walls and no distortion. Never alter the bottle or lid structure. Use bold varsity style fonts for vertical names in bright red, sharp and straight. Create a hyper realistic kids sports scene at football practice with the bottles arranged on or near a cooler on the sideline, pads and helmets nearby, and players in the background."
  },
  {
    "id": 33,
    "category": "kids_sports",
    "aspect_ratio": "16:9",
    "tags": ["kids_sports", "tournament_table", "coach_view"],
    "lighting": "outdoor event lighting, slightly cloudy",
    "name_color": "mixed bright colors",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render a group of Shelzys Designs white aluminum matte flip-straw bottles, each exactly matching the real product silhouette, height, curvature, handle, lid seam, and flip-straw mechanism, with straight smooth walls. Never change the bottle or lid structure. Use bold block fonts for vertical names in mixed bright colors, all crisp and aligned. Create a hyper realistic scene of a team tournament registration or coach table with all the bottles lined up, clipboards and whistles visible, and fields in the background, emphasizing team organization and personalization."
  },
  {
    "id": 34,
    "category": "kids_sports",
    "aspect_ratio": "16:9",
    "tags": ["kids_sports", "trophy_table", "celebration"],
    "lighting": "indoor gym or banquet lighting, warm and celebratory",
    "name_color": "gold",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Depict several Shelzys Designs white aluminum matte flip-straw bottles with exact matching silhouette, curvature, height, handle, lid seam, and flip-straw hinge as my real product, with a straight smooth wall and no distortion. Never alter the bottle or lid structure. Use bold premium type for vertical names in gold color, crisp and straight. Create a hyper realistic kids sports celebration scene with the bottles arranged on a table next to trophies and medals, gym or banquet background softly blurred, conveying end of season awards and keepsakes."
  },
  {
    "id": 35,
    "category": "palm_beach_1964",
    "aspect_ratio": "3:2",
    "tags": ["palm_beach_1964", "slim_aarons", "pool_deck", "vintage"],
    "lighting": "bright 1960s style midday sun with soft film grain",
    "name_color": "sage green",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always render the white aluminum matte Shelzys Designs flip-straw bottle with the exact silhouette, height, curvature, handle, lid seam, and flip-straw mechanism as my real product photos, with smooth straight walls and no distortion. Never alter the bottle or lid structure. Use a refined serif font in sage green for the name, horizontal and crisp. Create a hyper realistic Slim Aarons inspired Palm Beach 1964 scene on a club pool deck with striped umbrellas, lounge chairs, and guests in vintage preppy resort clothing, the bottle styled among cocktails and sunglasses as part of an effortless luxury composition."
  },
  {
    "id": 36,
    "category": "palm_beach_1964",
    "aspect_ratio": "3:2",
    "tags": ["palm_beach_1964", "tennis_court", "preppy"],
    "lighting": "bright coastal sun with soft shadows and slight grain",
    "name_color": "navy blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Show the Shelzys Designs white aluminum matte flip-straw bottle with perfectly accurate silhouette, curvature, height, handle, lid seam, and flip-straw hinge as in my product photos, with a smooth straight wall and no distortion. Never change the bottle or lid structure. Use a tall clean serif font in navy blue for the vertical name, crisp and elegant. Create a hyper realistic Palm Beach 1964 inspired tennis scene on a green court with vintage rackets, tennis whites, and a striped towel, the bottle prominently placed courtside in an editorial composition that feels like a luxury magazine spread."
  },
  {
    "id": 37,
    "category": "palm_beach_1964",
    "aspect_ratio": "3:2",
    "tags": ["palm_beach_1964", "yacht_club", "dock"],
    "lighting": "warm late afternoon coastal light with vintage film feel",
    "name_color": "dark forest green",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Depict the white aluminum matte Shelzys Designs flip-straw bottle with exact silhouette, height, curvature, handle shape, lid seam, and flip-straw geometry as my real product, with straight smooth walls and no distortion. Never modify the bottle or lid structure. Use a classic serif font in dark forest green for the horizontal name, crisp and premium. Create a hyper realistic Palm Beach 1964 yacht club scene with the bottle on a wooden dock near coiled ropes and boating accessories, elegant guests and boats in the softly blurred background, with warm nostalgic lighting."
  },
  {
    "id": 38,
    "category": "palm_beach_1964",
    "aspect_ratio": "3:2",
    "tags": ["palm_beach_1964", "croquet_lawn", "club_scene"],
    "lighting": "afternoon lawn light, soft and slightly hazy",
    "name_color": "sage green",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render the Shelzys Designs white aluminum matte flip-straw bottle with the exact same silhouette, curvature, height, handle, lid seam, and flip-straw mechanism as the real product photos, with perfectly straight smooth walls. Never alter the bottle or lid structure. Use a refined serif font in sage green for the vertical name, crisp and aligned. Create a hyper realistic Palm Beach 1964 croquet lawn scene with the bottle on a small side table near mallets, balls, and striped club chairs, guests in preppy attire, and a soft vintage film grain aesthetic."
  },
  {
    "id": 39,
    "category": "palm_beach_1964",
    "aspect_ratio": "3:2",
    "tags": ["palm_beach_1964", "veranda", "cocktail_hour"],
    "lighting": "golden hour veranda light with warm highlights",
    "name_color": "navy blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always show the white aluminum matte Shelzys Designs flip-straw bottle with perfectly accurate silhouette, height, curvature, handle, lid seam, and flip-straw hinge matching my product photos, with a smooth straight wall and no distortion. Never change the bottle or lid structure. Use a tall elegant serif font in navy blue for the name, horizontal and crisp. Create a hyper realistic Palm Beach 1964 veranda cocktail scene with the bottle subtly styled among classic barware on a veranda railing or table, overlooking the ocean, with guests in 1960s resort wear and warm golden light."
  },
  {
    "id": 40,
    "category": "palm_beach_1964",
    "aspect_ratio": "3:2",
    "tags": ["palm_beach_1964", "lobby", "club_interior"],
    "lighting": "soft interior light with warm vintage tones",
    "name_color": "deep hunter green",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Depict the Shelzys Designs white aluminum matte flip-straw bottle with exact silhouette, curvature, height, handle shape, lid seam, and flip-straw geometry seen in my real product photos, with straight smooth walls and no distortion. Never alter the bottle or lid structure. Use a refined serif font in deep hunter green for the name, horizontal and centered. Create a hyper realistic Palm Beach 1964 inspired club interior scene with the bottle on a polished wooden console or bar cart surrounded by vintage framed art, brass details, and classic club decor in a warm nostalgic palette."
  },
  {
    "id": 41,
    "category": "palm_beach_1964",
    "aspect_ratio": "3:2",
    "tags": ["palm_beach_1964", "beach_cabana", "umbrella"],
    "lighting": "bright beach daylight with gentle film grain",
    "name_color": "sage green",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render the white aluminum matte Shelzys Designs flip-straw bottle with perfectly accurate silhouette, height, curvature, handle shape, lid seam, and flip-straw mechanism, with smooth straight walls and no distortion. Never change the bottle or lid structure. Use a premium serif font in sage green for the vertical name, crisp and elegant. Create a hyper realistic Palm Beach 1964 beach cabana scene with the bottle on a small side table under a striped umbrella, seersucker textures, towels, and vintage beach chairs, framed like a Slim Aarons photograph with editorial composition."
  },
  {
    "id": 42,
    "category": "palm_beach_1964",
    "aspect_ratio": "3:2",
    "tags": ["palm_beach_1964", "golf_cart", "resort"],
    "lighting": "late afternoon resort light with soft shadows",
    "name_color": "navy blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always depict the Shelzys Designs white aluminum matte flip-straw bottle with the exact same silhouette, curvature, height, handle, lid seam, and flip-straw hinge as in my product photos, with straight smooth walls and no distortion. Never alter the bottle or lid structure. Use a tall serif or clean sans serif font in navy blue for the horizontal name, crisp and premium. Create a hyper realistic Palm Beach 1964 resort scene with the bottle resting in a golf cart cupholder or seat, surrounded by preppy details and lush grounds, with a subtle vintage film aesthetic."
  },
  {
    "id": 43,
    "category": "instagram_feed",
    "aspect_ratio": "1:1",
    "tags": ["instagram", "minimal", "flat_lay"],
    "lighting": "soft diffused daylight, minimal shadows",
    "name_color": "charcoal gray",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render the Shelzys Designs white aluminum matte flip-straw bottle with perfectly accurate silhouette, curvature, height, handle shape, lid seam, and flip-straw mechanism, with smooth straight walls and no distortion. Never change the bottle or lid structure. Use a clean minimalist font in charcoal gray for the name, centered and crisp. Create a hyper realistic minimal Instagram feed image, shot from above on a clean white surface with just the bottle, a small sprig of greenery, and ample negative space for a modern grid aesthetic."
  },
  {
    "id": 44,
    "category": "instagram_feed",
    "aspect_ratio": "4:5",
    "tags": ["instagram", "aesthetic_bedside", "soft"],
    "lighting": "soft warm bedside light",
    "name_color": "soft taupe",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Show the white aluminum matte Shelzys Designs flip-straw bottle with exact silhouette, height, curvature, handle, lid seam, and flip-straw geometry as the real product, with smooth straight walls and no distortion. Never alter the bottle or lid structure. Use an elegant serif font in soft taupe for the horizontal name, crisp and subtle. Create a hyper realistic Instagram feed image of the bottle on a nightstand next to a candle and a small stack of books, blurred bedding in the background, evoking a cozy evening routine."
  },
  {
    "id": 45,
    "category": "instagram_feed",
    "aspect_ratio": "4:5",
    "tags": ["instagram", "mirror_selfie_style", "fashion"],
    "lighting": "natural daylight from a window, soft but bright",
    "name_color": "black",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Depict the Shelzys Designs white aluminum matte flip-straw bottle with perfectly accurate silhouette, curvature, height, handle, lid seam, and flip-straw hinge as my product photos, with a straight smooth wall and no distortion. Never change the bottle or lid structure. Use a clean bold font in black for the vertical name, sharp and straight. Create a hyper realistic Instagram style image that feels like a mirror selfie, with the bottle held in front of a neutral outfit, mirror and room details softly blurred, framed as a stylish lifestyle detail."
  },
  {
    "id": 46,
    "category": "instagram_feed",
    "aspect_ratio": "4:5",
    "tags": ["instagram", "work_cafe", "laptop"],
    "lighting": "cafe daylight, a bit moody and directional",
    "name_color": "navy blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render the Shelzys Designs white aluminum matte flip-straw bottle with exact silhouette, curvature, height, handle shape, lid seam, and flip-straw mechanism matching my real product, with straight smooth walls and no distortion. Never alter the bottle or lid structure. Use a premium sans serif font in navy blue for the horizontal name, crisp and centered. Create a hyper realistic Instagram feed image with the bottle on a cafe table next to a laptop and coffee cup, background softly blurred, giving productive creator energy."
  },
  {
    "id": 47,
    "category": "hero_banner",
    "aspect_ratio": "16:9",
    "tags": ["hero_banner", "website", "clean", "negative_space"],
    "lighting": "soft, even studio lighting with gentle gradient background",
    "name_color": "sage green",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Always render the Shelzys Designs white aluminum matte flip-straw bottle with the exact silhouette, height, curvature, handle, lid seam, and flip-straw geometry as my real product photos, with a straight smooth wall and no distortion. Never change the bottle or lid structure. Use a refined serif font in sage green for the name, horizontal and crisp. Create a hyper realistic wide hero banner image for ShelzysDesigns.com: the bottle large on one side against a soft neutral gradient background with substantial empty space on the opposite side for headline text, conveying premium, modern, direct to consumer branding."
  },
  {
    "id": 48,
    "category": "hero_banner",
    "aspect_ratio": "16:9",
    "tags": ["hero_banner", "website", "lifestyle_poolside"],
    "lighting": "bright natural outdoor light with soft shadows",
    "name_color": "navy blue",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Depict the white aluminum matte Shelzys Designs flip-straw bottle with perfectly accurate silhouette, curvature, height, handle, lid seam, and flip-straw mechanism as in my product photos, with smooth straight walls and no distortion. Never alter the bottle or lid structure. Use a clean serif or sans serif font in navy blue for the vertical name, crisp and elegant. Create a hyper realistic wide hero banner image featuring a poolside scene with the bottle in the foreground and a blurred resort pool and umbrellas in the background, leaving one side of the frame fairly open for website headline copy."
  },
  {
    "id": 49,
    "category": "hero_banner",
    "aspect_ratio": "16:9",
    "tags": ["hero_banner", "website", "desk_productivity"],
    "lighting": "soft daylight from the side, subtle gradient shadows",
    "name_color": "charcoal gray",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Render the Shelzys Designs white aluminum matte flip-straw bottle with exact silhouette, height, curvature, handle shape, lid seam, and flip-straw geometry as my real product photos, with straight smooth walls and no distortion. Never change the bottle or lid structure. Use a clean minimalist font in charcoal gray for the horizontal name, crisp and centered. Create a hyper realistic wide hero banner image showing the bottle on a stylish desk with a laptop, notebook, and pen, framed so that the left or right third of the image has negative space for headline and call to action text."
  },
  {
    "id": 50,
    "category": "hero_banner",
    "aspect_ratio": "21:9",
    "tags": ["hero_banner", "website", "multi_bottle_lineup"],
    "lighting": "studio lighting with soft reflections and gentle gradient floor",
    "name_color": "mixed navy, coral, sage, black",
    "prompt": "You are the dedicated creative director and senior product photographer for Shelzys Designs. Show a row of Shelzys Designs white aluminum matte flip-straw bottles, all with the exact same silhouette, height, curvature, handle, lid seam, and flip-straw mechanism as my real product photos, with smooth straight walls and no distortion. Never alter the bottle or lid structure. Use premium fonts with names in a mix of navy, coral, sage, and black, all crisp and straight. Create a hyper realistic ultra wide hero banner image with the bottles lined up across the frame on a subtle reflective surface, background a soft neutral gradient, leaving room above or below for site navigation and branding while clearly showcasing personalization options."
  }
];

/**
 * Map aspect ratio to DALL-E 3 supported sizes
 * DALL-E 3 supports: 1024x1024, 1792x1024, 1024x1792
 */
function aspectRatioToSize(ratio: string): { width: number; height: number; dalleSize: ImageSize } {
  switch (ratio) {
    case "1:1":
      return { width: 1024, height: 1024, dalleSize: "1024x1024" };
    case "4:5":
      // Portrait - use 1024x1792 (closest to 4:5)
      return { width: 1024, height: 1280, dalleSize: "1024x1792" };
    case "2:3":
      // Portrait - use 1024x1792
      return { width: 1024, height: 1536, dalleSize: "1024x1792" };
    case "3:2":
      // Landscape - use 1792x1024
      return { width: 1200, height: 800, dalleSize: "1792x1024" };
    case "16:9":
      // Landscape - use 1792x1024 (closest to 16:9)
      return { width: 1792, height: 1024, dalleSize: "1792x1024" };
    case "9:16":
      // Portrait - use 1024x1792
      return { width: 1024, height: 1792, dalleSize: "1024x1792" };
    case "21:9":
      // Ultra-wide landscape - use 1792x1024 (will need cropping for true 21:9)
      return { width: 2100, height: 900, dalleSize: "1792x1024" };
    default:
      return { width: 1024, height: 1024, dalleSize: "1024x1024" };
  }
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an image using OpenAI's DALL-E 3 API
 */
async function generateImage(prompt: string, dalleSize: ImageSize): Promise<Buffer> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: dalleSize,
    quality: "hd",
    response_format: "b64_json",
  });

  const b64Data = response.data[0].b64_json;
  if (!b64Data) {
    throw new Error("No image data returned from API");
  }

  return Buffer.from(b64Data, "base64");
}

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Main function to generate all images
 */
async function main() {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error("ERROR: OPENAI_API_KEY environment variable is required");
    console.error("Set it with: export OPENAI_API_KEY=your-api-key");
    process.exit(1);
  }

  const isDryRun = process.env.DRY_RUN === "true";
  const startId = parseInt(process.env.START_ID || "1", 10);
  const endId = parseInt(process.env.END_ID || "50", 10);

  console.log("=".repeat(60));
  console.log("Shelzys Designs - Automated Image Generator");
  console.log("=".repeat(60));
  console.log(`Mode: ${isDryRun ? "DRY RUN (no images will be generated)" : "PRODUCTION"}`);
  console.log(`Processing prompts ${startId} through ${endId}`);
  console.log("=".repeat(60));

  // Create output directory
  const outDir = path.join(process.cwd(), "shelzys_images");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    console.log(`Created output directory: ${outDir}`);
  }

  let success = 0;
  let failure = 0;
  let skipped = 0;

  // Filter prompts by ID range
  const promptsToProcess = prompts.filter((p) => p.id >= startId && p.id <= endId);

  for (const item of promptsToProcess) {
    const { id, category, aspect_ratio, prompt } = item;
    const { dalleSize } = aspectRatioToSize(aspect_ratio);

    const safeCategory = category.toLowerCase().replace(/\s+/g, "_");
    const safeRatio = aspect_ratio.replace(":", "x");
    const filename = `shelzys_${id}_${safeCategory}_${safeRatio}.png`;
    const filepath = path.join(outDir, filename);

    // Check if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`[${id}/50] SKIP: ${filename} (already exists)`);
      skipped++;
      continue;
    }

    console.log(`[${id}/50] Generating: ${filename}`);
    console.log(`         Category: ${category}`);
    console.log(`         Aspect: ${aspect_ratio} -> DALL-E size: ${dalleSize}`);

    if (isDryRun) {
      console.log(`         [DRY RUN] Would generate image`);
      success++;
      continue;
    }

    try {
      const img = await generateImage(prompt, dalleSize);
      fs.writeFileSync(filepath, img);
      console.log(`         SUCCESS: Saved ${filename} (${img.length} bytes)`);
      success++;

      // Rate limiting: DALL-E 3 has limits, add a small delay between requests
      // Default tier: 7 images per minute = ~8.5 seconds between requests
      // We'll use 10 seconds to be safe
      if (id < promptsToProcess[promptsToProcess.length - 1].id) {
        console.log(`         Waiting 10 seconds before next request...`);
        await sleep(10000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`         FAILED: ${errorMessage}`);
      failure++;

      // If rate limited, wait longer and continue
      if (errorMessage.includes("rate_limit") || errorMessage.includes("429")) {
        console.log(`         Rate limited. Waiting 60 seconds...`);
        await sleep(60000);
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("GENERATION COMPLETE");
  console.log("=".repeat(60));
  console.log(`Success: ${success}`);
  console.log(`Failed:  ${failure}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total:   ${success + failure + skipped}`);
  console.log("=".repeat(60));

  if (failure > 0) {
    console.log("\nTo retry failed images, run again - existing files will be skipped.");
  }
}

// Run the main function
main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
