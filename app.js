let language='en';
const menu={savory:[['Sandwich Déjeuner',14,'House focaccia, pork or beef longganisa, arugula, scrambled egg & atchara.','Focaccia maison, longganisa (porc ou bœuf), roquette, œuf brouillé, atchara.'],['Tartine Champi Adobo',15,'MOLLO rye bread, black garlic & herb yogurt, wild adobo mushrooms, arugula & daisy buds.','Pain de seigle MOLLO, yogourt ail noir et herbes, champignons sauvages adobo, roquette, boutons de marguerite.'],['Salade Kalabasa',15,'Roasted squash, coconut kabocha purée, green beans, bok choy, whipped goat cheese & spicy honey.','Courge rôtie, purée de kabocha coco, haricots verts, bok choy toyonamisi, chèvre fouettée, miel épicé, babeurre coco.'],['Grilled Cheese',10,'MOLLO country bread, 2-year cheddar & camembert. Add pistachio pesto $1.50, sun-dried tomato $1 or atchara $1.','Pain de campagne MOLLO, cheddar 2 ans, camembert. Suppléments : pesto pistache 1,50 $, tomate séchée 1 $, atchara 1 $.']],sweet:[['Pandesal',6,'Filipino bread roll, chive butter. Choose mango & peach, cranberry & lime, or banana & vanilla jam.','Petit pain filipino, beurre ciboulette. Confiture au choix : mangue et pêche, canneberge lime, banane vanille.'],['Yogurt et Fruits de saison',9,'Greek yogurt, cranberry compote, pomegranate, pecan granola & apple-maple caramel.','Yogourt grec, compotée de canneberge, pomme grenade, granola pacane, caramel pomme érable.'],['Tarte Buko de DrePies',9,'Shortcrust pastry, pastry cream & coconut.','Pâte brisée, crème pâtissière, jaune de coco.']]};
function renderMenu(){for(const category of ['savory','sweet']){const panel=document.getElementById(category+'-items');panel.replaceChildren();for(const item of menu[category]){const article=document.createElement('article');article.className='menu-item';const text=document.createElement('div');const h=document.createElement('h3');h.textContent=item[0];const p=document.createElement('p');p.textContent=item[language==='fr'?3:2];text.append(h,p);const price=document.createElement('span');price.className='price';price.textContent=item[1]+' $';article.append(text,price);panel.append(article);}}}
document.querySelector('#language').addEventListener('click',()=>{language=language==='en'?'fr':'en';document.documentElement.lang=language;document.querySelectorAll('[data-en][data-fr]').forEach(el=>el.textContent=el.dataset[language]);const button=document.getElementById('language');button.textContent=language==='en'?'Français':'English';button.setAttribute('aria-label',language==='en'?'Switch to French':'Passer en anglais');renderMenu();refreshTactileMotion();refreshTextMotion();});
renderMenu();
const page=document.querySelector('.page');function syncAssetScale(){const scale=Math.min(page.clientWidth,950)/1440;page.style.setProperty('--scene-scale',scale);page.style.setProperty('--logo-scale',scale);page.style.setProperty('--mobile-rays-scale',Math.min(page.clientWidth*.843,371)/657.382);}new ResizeObserver(syncAssetScale).observe(page);syncAssetScale();

const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let tactileObserver=null;
let linedPaperObserver=null;
const tactileTargets=new Set();
function refreshTactileMotion(){
 if(!('IntersectionObserver' in window)||motionPreference.matches)return;
 if(!tactileObserver){
  tactileObserver=new IntersectionObserver(entries=>{
   for(const entry of entries){
    const surface=entry.target;
    if(entry.isIntersecting&&entry.intersectionRatio>=.08){
     if(surface.dataset.motion!=='visible'){
      surface.dataset.edge=entry.boundingClientRect.top<0?'above':'below';
      surface.dataset.motion='visible';
     }
    }else if(!entry.isIntersecting){
     surface.dataset.edge=entry.boundingClientRect.bottom<innerHeight*.5?'above':'below';
     surface.dataset.motion='outside';
    }
   }
  },{rootMargin:'-4% 0px -4% 0px',threshold:[0,.08]});
 }
 for(const surface of tactileTargets){if(!surface.isConnected){tactileObserver.unobserve(surface);tactileTargets.delete(surface);}}
 const surfaces=document.querySelectorAll('.story-paper,.notebook-group,.menu-banner,.menu-photo,.menu-item');
 surfaces.forEach((surface,index)=>{
  if(tactileTargets.has(surface))return;
  surface.classList.add('tactile-surface');
  if(surface.matches('.story-paper,.notebook-group'))surface.classList.add('tactile-sheet');
  surface.style.setProperty('--tactile-tilt',(index%2?'-':'')+(surface.matches('.menu-item')?'.45deg':'1.8deg'));
  surface.style.setProperty('--tactile-delay',surface.matches('.menu-item')?(index%3)*35+'ms':surface.matches('.notebook-front-group')?'65ms':'0ms');
  const bounds=surface.getBoundingClientRect();
  surface.dataset.edge=bounds.bottom<0?'above':'below';
  surface.dataset.motion='outside';
  tactileTargets.add(surface);
  if(!surface.matches('.notebook-group'))tactileObserver.observe(surface);
 });
 // The paper tops are hidden behind the story: use the address block as
 // their scroll trigger so they arrive when the locations come into view.
 if(!linedPaperObserver){
  linedPaperObserver=new IntersectionObserver(entries=>{
   for(const entry of entries){
    const entering=entry.isIntersecting&&entry.intersectionRatio>=.12;
    const leavingUp=!entry.isIntersecting&&entry.boundingClientRect.top>=(entry.rootBounds?.bottom??innerHeight*.8);
    if(entering||leavingUp){
     document.querySelectorAll('.notebook-group').forEach(paper=>{
      if(entering){
       if(paper.dataset.motion!=='visible')paper.dataset.motion='visible';
       else if(paper.dataset.paperDirection==='out'){
        const animation=paper.getAnimations().find(item=>item.animationName==='paper-fly-in');
        if(animation&&animation.playbackRate<0)animation.reverse();
       }
       paper.dataset.paperDirection='in';
      }else if(paper.dataset.motion==='visible'&&paper.dataset.paperDirection!=='out'){
       // Reverse the very same animation, including its bounce and current progress.
       const animation=paper.getAnimations().find(item=>item.animationName==='paper-fly-in');
       if(animation&&animation.playbackRate>0)animation.reverse();
       paper.dataset.paperDirection='out';
      }
     });
    }
    // Crossing the top edge while scrolling onward leaves the papers in place.
   }
  },{rootMargin:'0px 0px -20% 0px',threshold:[0,.12]});
  const trigger=document.querySelector('.locations-trigger');
  if(trigger)linedPaperObserver.observe(trigger);
 }
 document.documentElement.classList.add('tactile-motion');
}
motionPreference.addEventListener('change',()=>{
 if(motionPreference.matches){
  tactileObserver?.disconnect();tactileObserver=null;
  linedPaperObserver?.disconnect();linedPaperObserver=null;
  document.documentElement.classList.remove('tactile-motion');
  for(const surface of tactileTargets){surface.classList.remove('tactile-surface','tactile-sheet');delete surface.dataset.motion;delete surface.dataset.edge;delete surface.dataset.paperDirection;}
  tactileTargets.clear();
 }else refreshTactileMotion();
});
refreshTactileMotion();

let textObserver=null;
const textTargets=new Set();
function prepareHeading(heading){
 if(heading.querySelector('.text-word'))return;
 const label=heading.innerText.replace(/\s+/g,' ').trim();
 if(label)heading.setAttribute('aria-label',label);
 const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 let wordIndex=0;
 for(const node of nodes){
  const fragment=document.createDocumentFragment();
  for(const token of node.textContent.split(/(\s+)/)){
   if(!token)continue;
   if(/^\s+$/.test(token)){fragment.append(document.createTextNode(token));continue;}
   const word=document.createElement('span');word.className='text-word';word.textContent=token;
   word.setAttribute('aria-hidden','true');
   word.style.setProperty('--word-delay',Math.min(wordIndex*55,280)+'ms');
   fragment.append(word);wordIndex++;
  }
  node.replaceWith(fragment);
 }
}
function refreshTextMotion(){
 if(!('IntersectionObserver' in window)||motionPreference.matches)return;
 if(!textObserver){
  textObserver=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(entry.isIntersecting&&entry.intersectionRatio>=.12)entry.target.dataset.textMotion='entered';
    else if(!entry.isIntersecting)entry.target.dataset.textMotion='waiting';
   }
  },{rootMargin:'0px 0px -4% 0px',threshold:[0,.12]});
 }
 for(const target of textTargets){if(!target.isConnected){textObserver.unobserve(target);textTargets.delete(target);}}
 const targets=document.querySelectorAll('main h1,main h2,main h3,.hero-description,.story-copy>p,.location p,.menu-banner p,.menu-item p,.hours,.footer-locations>p,.kicker,.menu-banner-copy>.hand,.new-location');
 for(const target of targets){
  if(target.closest('.locations-copy'))continue;
  const heading=/^H[123]$/.test(target.tagName);
  if(heading)prepareHeading(target);
  if(textTargets.has(target))continue;
  const note=target.matches('.kicker,.story-kicker,.menu-banner-copy>.hand,.new-location');
  target.classList.add(heading?'type-heading':note?'type-note':'type-body');
  target.style.setProperty('--text-delay',heading?'60ms':note?'0ms':target.closest('.menu-item')?'150ms':'180ms');
  target.dataset.textMotion='waiting';textTargets.add(target);textObserver.observe(target);
 }
 document.documentElement.classList.add('text-motion');
}
motionPreference.addEventListener('change',()=>{
 textObserver?.disconnect();textObserver=null;
 document.documentElement.classList.remove('text-motion');
 for(const target of textTargets)delete target.dataset.textMotion;
 textTargets.clear();
 if(!motionPreference.matches)refreshTextMotion();
});
refreshTextMotion();

// The original handwritten font appears one letter at a time on entry.
const orderNote=document.querySelector('.order-letter-note');
if(orderNote){
 const letters=Array.from(orderNote.textContent).map((letter,index)=>{
  const span=document.createElement('span');
  span.className='order-letter';span.textContent=letter;
  span.setAttribute('aria-hidden','true');
  span.style.setProperty('--letter-index',index);
  return span;
 });
 orderNote.replaceChildren(...letters);
}
let orderLetterObserver=null;
function refreshOrderLetterMotion(){
 orderLetterObserver?.disconnect();
 document.documentElement.classList.remove('order-letter-motion');
 if(!orderNote||motionPreference.matches||!('IntersectionObserver' in window))return;
 orderNote.dataset.letters='waiting';
 document.documentElement.classList.add('order-letter-motion');
 orderLetterObserver=new IntersectionObserver(entries=>{
  for(const entry of entries)entry.target.dataset.letters=entry.isIntersecting?'entered':'waiting';
 },{threshold:.65});
 orderLetterObserver.observe(orderNote);
}
motionPreference.addEventListener('change',refreshOrderLetterMotion);
refreshOrderLetterMotion();

// Keep footer art settled while scrolling onward; rewind the same motions on the way up.
let footerArtObserver=null;
const doodleParade=document.querySelector('.doodle-parade');
const footerFriend=document.querySelector('.footer-friend-anchor');
const footerRule=document.querySelector('.copyright');
doodleParade?.querySelectorAll('img').forEach((art,index)=>{
 art.style.setProperty('--doodle-delay',index*48+'ms');
 art.style.setProperty('--doodle-angle',(index%2?-1:1)*(8+index%3*3)+'deg');
 art.style.setProperty('--doodle-x',art.matches('.doodle-truck')?'-75px':(index%2?-20:20)+'px');
});
function refreshFooterArtMotion(){
 footerArtObserver?.disconnect();
 document.documentElement.classList.remove('footer-motion');
 for(const surface of [doodleParade,footerFriend]){
  if(surface){delete surface.dataset.footerMotion;delete surface.dataset.footerDirection;}
 }
 if(motionPreference.matches||!('IntersectionObserver' in window))return;
 document.documentElement.classList.add('footer-motion');
 footerArtObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
   const surface=entry.target===footerRule?footerFriend:doodleParade;
   if(!surface)continue;
   const entering=entry.isIntersecting&&entry.intersectionRatio>=.12;
   const leavingUp=!entry.isIntersecting&&entry.boundingClientRect.top>=(entry.rootBounds?.bottom??innerHeight);
   if(entering){
    if(surface.dataset.footerMotion!=='entered')surface.dataset.footerMotion='entered';
    else if(surface.dataset.footerDirection==='out'){
     surface.querySelectorAll('img').forEach(art=>{
      art.getAnimations().filter(a=>['doodle-pop-in','footer-girl-rise'].includes(a.animationName)).forEach(a=>{if(a.playbackRate<0)a.reverse();});
     });
    }
    surface.dataset.footerDirection='in';
   }else if(leavingUp&&surface.dataset.footerMotion==='entered'&&surface.dataset.footerDirection!=='out'){
    surface.querySelectorAll('img').forEach(art=>{
     art.getAnimations().filter(a=>['doodle-pop-in','footer-girl-rise'].includes(a.animationName)).forEach(a=>{if(a.playbackRate>0)a.reverse();});
    });
    surface.dataset.footerDirection='out';
   }
  }
 },{threshold:[0,.12]});
 if(doodleParade)footerArtObserver.observe(doodleParade);
 if(footerRule&&footerFriend)footerArtObserver.observe(footerRule);
}
motionPreference.addEventListener('change',refreshFooterArtMotion);
refreshFooterArtMotion();

// Start the hero sequence after the actual sandwich image is ready, including cold loads.
const heroArt=document.querySelector('.hero-art');
const heroImage=heroArt?.querySelector('.hero-sandwich');
if(heroArt&&heroImage){
 document.documentElement.classList.add('hero-sequence');
 const revealHero=async()=>{
  if(heroImage.decode){try{await heroImage.decode();}catch{}}
  heroArt.dataset.heroReady='true';
 };
 if(heroImage.complete&&heroImage.naturalWidth)revealHero();
 else heroImage.addEventListener('load',revealHero,{once:true});
}
