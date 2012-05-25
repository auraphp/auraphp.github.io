
<!-- saved from url=(0086)https://raw.github.com/gist/1455726/316a4c21d444221f9b3c4a67a9b270b88c82952a/oembed.rb -->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">##
# OEmbed Liquid Tag for Jekyll
#   - requires https://github.com/judofyr/ruby-oembed/
#
# Copyright 2011 Tammo van Lessen
# 
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
# 
#        http://www.apache.org/licenses/LICENSE-2.0
# 
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
##
require 'oembed'
require 'uri'

# register all default OEmbed providers
::OEmbed::Providers.register_all()
# since register_all does not register all default providers, we need to do this here. See https://github.com/judofyr/ruby-oembed/issues/18
::OEmbed::Providers.register(::OEmbed::Providers::Instagram, ::OEmbed::Providers::Slideshare, ::OEmbed::Providers::Yfrog, ::OEmbed::Providers::MlgTv)
::OEmbed::Providers.register_fallback(::OEmbed::ProviderDiscovery, ::OEmbed::Providers::Embedly, ::OEmbed::Providers::OohEmbed)

module Jekyll
  class OEmbed &lt; Liquid::Tag

    def initialize(tag_name, text, tokens)
       super
       @text = text
    end
    
    def render(context)
      # pipe param through liquid to make additional replacements possible
      url = Liquid::Template.parse(@text).render context

      # oembed look up
      result = ::OEmbed::Providers.get(url.strip!, :format =&gt; :xml)
      
      # Odd: slideshare uses provider-name instead of provider_name
      provider = result.fields['provider_name'] || result.fields['provider-name'] || 'unknown'

      "&lt;div class=\"embed #{result.type} #{provider}\"&gt;#{result.html}&lt;/div&gt;"
    end
  end
end

Liquid::Template.register_tag('oembed', Jekyll::OEmbed)
</pre></body></html>