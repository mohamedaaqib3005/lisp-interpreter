(define (primeno n)
  (define (helper i)
    (if (<= n 1)
        #f
        (if (= i n)
            #t
            (if (= (modulo n i) 0)
                #f
                (helper (+ i 1))))))
  (if (= n 2)
      #t
      (helper 2)))